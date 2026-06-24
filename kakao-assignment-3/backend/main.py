import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional

# .env.local 로드
load_dotenv(".env.local")

# DB 설정 (환경변수에서 읽기)
DATABASE_URL = os.environ["DATABASE_URL"]
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# DB 모델 (테이블 구조 정의)
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    done = Column(Boolean, default=False)
    target_date = Column(String, nullable=True) # YYYY-MM-DD 형식

# Pydantic 스키마 (요청/응답 데이터 구조 정의)
class TodoCreate(BaseModel):
    title: str
    done: bool = False
    target_date: Optional[str] = None

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    done: Optional[bool] = None
    target_date: Optional[str] = None

# 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI(title="Todo API")

# FastAPI 앱 미들웨어 및 CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 엔드포인트 구현

# GET /todos - 전체 Todo 목록 조회 (기간 필터링 포함)
@app.get("/todos")
def read_todos(
    start_date: Optional[str] = Query(None, description="시작 날짜 (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="종료 날짜 (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    query = db.query(Todo)
    if start_date:
        query = query.filter(Todo.target_date >= start_date)
    if end_date:
        query = query.filter(Todo.target_date <= end_date)
    return query.all()

# POST /todos - 새 Todo 생성
@app.post("/todos")
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(title=todo.title, done=todo.done, target_date=todo.target_date)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

# PUT /todos/{id} - Todo 수정
@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    if todo.title is not None:
        db_todo.title = todo.title
    if todo.done is not None:
        db_todo.done = todo.done
    if todo.target_date is not None:
        db_todo.target_date = todo.target_date
    db.commit()
    db.refresh(db_todo)
    return db_todo

# DELETE /todos/{id} - Todo 삭제
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
    return {"detail": "Todo deleted"}