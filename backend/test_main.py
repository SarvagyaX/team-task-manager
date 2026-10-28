
from fastapi.testclient import TestClient
from main import app, initialize

client = TestClient(app)


def setup_module():
    initialize()


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_crud():
    payload = {
        "title": "test",
        "description": "test",
        "status": "test",
        "priority": "test",
        "assignee": "test",
    }

    created = client.post("/tasks", json=payload)
    assert created.status_code == 201

    record = created.json()
    record_id = record["id"]
    assert record["title"] == "test"

    listed = client.get("/tasks")
    assert listed.status_code == 200
    assert any(item["id"] == record_id for item in listed.json())

    fetched = client.get(f"/tasks/{record_id}")
    assert fetched.status_code == 200
    assert fetched.json()["id"] == record_id

    updated_payload = {**payload, "title": "updated"}
    updated = client.put(
        f"/tasks/{record_id}", json=updated_payload
    )
    assert updated.status_code == 200
    assert updated.json()["title"] == "updated"

    deleted = client.delete(f"/tasks/{record_id}")
    assert deleted.status_code == 204

    missing = client.get(f"/tasks/{record_id}")
    assert missing.status_code == 404
