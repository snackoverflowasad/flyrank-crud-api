# Task Management API

A lightweight, robust in-memory RESTful CRUD API built with Node.js and Express. It provides comprehensive task lifecycle management, input validation, strict HTTP status code semantics, OpenAPI 3.0 specification, and interactive Swagger UI documentation.

![Swagger UI Preview](docs/swagger-preview.svg)

---

## Quickstart

Run the following command to install dependencies and start the server:

```bash
npm install && npm start
```

The server starts locally at `http://localhost:3000`.

Interactive Swagger UI documentation is available at:
```
http://localhost:3000/docs
```

---

## Endpoints

| Method | Endpoint | Description | Request Body | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | API service metadata | None | `200 OK` |
| `GET` | `/health` | Server health check | None | `200 OK` |
| `GET` | `/stats` | Aggregated task statistics | None | `200 OK` |
| `POST` | `/reset` | Restores default seed tasks | None | `200 OK` |
| `GET` | `/tasks` | List all tasks (supports `?done=true/false` & `?search=query`) | None | `200 OK` |
| `GET` | `/tasks/:id` | Retrieve single task by numerical ID | None | `200 OK`, `404 Not Found` |
| `POST` | `/tasks` | Create a new task | `{"title": "Task title"}` | `201 Created`, `400 Bad Request` |
| `PUT` | `/tasks/:id` | Update task title and/or done status | `{"title": "New title", "done": true}` | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/tasks/:id` | Delete task by numerical ID | None | `204 No Content`, `404 Not Found` |

---

## Verified cURL Output

### 1. Root Metadata (`GET /`)
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 94
ETag: W/"5e-NhZO7IhTPOJK1ny3rvCgFcozmEM"
Date: Sat, 21 Nov 2026 16:40:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"name":"Task API","version":"1.0","endpoints":["/tasks","/stats","/reset","/health","/docs"]}
```

### 2. Health Check (`GET /health`)
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 15
ETag: W/"f-VaSQ4oDUiZblZNAEkkN+sX+q3Sg"
Date: Sat, 21 Nov 2026 16:40:04 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"status":"ok"}
```

### 3. List All Tasks (`GET /tasks`)
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 147
ETag: W/"93-48ZbuSVZ3OAoTHembGvEY0b0W68"
Date: Sat, 21 Nov 2026 16:40:04 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"title":"Learn backend basics","done":true},{"id":2,"title":"Build CRUD API","done":false},{"id":3,"title":"Push to GitHub","done":false}]
```

### 4. Create Task with Validation (`POST /tasks`)
```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write documentation"}'
```
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 51
ETag: W/"33-f7fy4ThiSbHmuQpPm/a+lLllEgU"
Date: Sat, 21 Nov 2026 16:40:04 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":4,"title":"Write documentation","done":false}
```

### 5. Update Task (`PUT /tasks/4`)
```bash
curl -i -X PUT http://localhost:3000/tasks/4 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'
```
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 50
ETag: W/"32-VuADOH28rlqbNYpxfQuAl7s1Ia4"
Date: Sat, 21 Nov 2026 16:40:04 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":4,"title":"Write documentation","done":true}
```

### 6. Delete Task (`DELETE /tasks/4`)
```bash
curl -i -X DELETE http://localhost:3000/tasks/4
```
```http
HTTP/1.1 204 No Content
X-Powered-By: Express
Date: Sat, 21 Nov 2026 16:40:04 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

### 7. Resource Not Found (`GET /tasks/99`)
```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 29
ETag: W/"1d-kQQdPQ+i/Wk9IgXh55Kh5auGltk"
Date: Sat, 21 Nov 2026 16:40:04 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Task 99 not found"}
```

---

## The Mortality Experiment

When tasks are created or modified during the runtime of this API and the Node.js process is stopped and restarted, all newly created and updated records disappear, reverting strictly to the initial three seed items. This occurs because the application stores data exclusively in the process's volatile heap memory (`RAM`), which is wiped when the operating system terminates the process, demonstrating the fundamental necessity of persistent databases.
