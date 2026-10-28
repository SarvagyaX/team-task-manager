
from contextlib import asynccontextmanager
from pathlib import Path
import sqlite3

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DB = Path(__file__).with_name("app.db")
TABLE = "tasks"
FIELDS = ["title", "description", "status", "priority", "assignee"]


class RecordIn(BaseModel):
    title: str
    description: str
    status: str
    priority: str
    assignee: str


class Record(RecordIn):
    id: int


def connect():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn


def initialize():
    columns = [
        "id INTEGER PRIMARY KEY AUTOINCREMENT",
        '"title" TEXT NOT NULL DEFAULT \'\'',
        '"description" TEXT NOT NULL DEFAULT \'\'',
        '"status" TEXT NOT NULL DEFAULT \'\'',
        '"priority" TEXT NOT NULL DEFAULT \'\'',
        '"assignee" TEXT NOT NULL DEFAULT \'\'',
    ]
    with connect() as conn:
        conn.execute(
            f"CREATE TABLE IF NOT EXISTS {TABLE} ({', '.join(columns)})"
        )


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize()
    yield


app = FastAPI(title="Team Task Manager API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "project": "Team Task Manager"}


@app.get("/tasks", response_model=list[Record])
def list_records(q: str | None = None):
    with connect() as conn:
        if q:
            where = " OR ".join(
                [f'CAST("{field}" AS TEXT) LIKE ?' for field in FIELDS]
            )
            rows = conn.execute(
                f"SELECT * FROM {TABLE} WHERE {where} ORDER BY id DESC",
                [f"%{q}%"] * len(FIELDS),
            ).fetchall()
        else:
            rows = conn.execute(
                f"SELECT * FROM {TABLE} ORDER BY id DESC"
            ).fetchall()
    return [dict(row) for row in rows]


@app.post("/tasks", response_model=Record, status_code=201)
def create_record(payload: RecordIn):
    values = payload.model_dump()
    cols = ", ".join([f'"{field}"' for field in FIELDS])
    marks = ", ".join(["?"] * len(FIELDS))

    with connect() as conn:
        cur = conn.execute(
            f"INSERT INTO {TABLE} ({cols}) VALUES ({marks})",
            [values[field] for field in FIELDS],
        )
        row = conn.execute(
            f"SELECT * FROM {TABLE} WHERE id = ?",
            (cur.lastrowid,),
        ).fetchone()

    return dict(row)


@app.get("/tasks/{record_id}", response_model=Record)
def get_record(record_id: int):
    with connect() as conn:
        row = conn.execute(
            f"SELECT * FROM {TABLE} WHERE id = ?", (record_id,)
        ).fetchone()

    if row is None:
        raise HTTPException(404, "Record not found")

    return dict(row)


@app.put("/tasks/{record_id}", response_model=Record)
def update_record(record_id: int, payload: RecordIn):
    values = payload.model_dump()
    updates = ", ".join([f'"{field}" = ?' for field in FIELDS])

    with connect() as conn:
        cur = conn.execute(
            f"UPDATE {TABLE} SET {updates} WHERE id = ?",
            [values[field] for field in FIELDS] + [record_id],
        )

        if cur.rowcount == 0:
            raise HTTPException(404, "Record not found")

        row = conn.execute(
            f"SELECT * FROM {TABLE} WHERE id = ?", (record_id,)
        ).fetchone()

    return dict(row)


@app.delete("/tasks/{record_id}", status_code=204)
def delete_record(record_id: int):
    with connect() as conn:
        cur = conn.execute(
            f"DELETE FROM {TABLE} WHERE id = ?", (record_id,)
        )

    if cur.rowcount == 0:
        raise HTTPException(404, "Record not found")
