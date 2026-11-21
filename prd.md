Build your first CRUD API
Build a small API that manages a to-do list — create, read, update and delete tasks — test it in
Swagger UI, and publish it to GitHub.
~6–8 h across 6 stages Stretch +2 h Bonus AI stage +1 h JavaScript or Python $0 · no credit card
PAIRED LIVE EVENT
Backend 101 — how the web
works
YOU WILL PRACTICE
HTTP · CRUD · status codes ·
Swagger UI · Git & GitHub
SUBMISSION
Public GitHub repo, ≥6 commits,
README
How to read this document: new words are shown in bold the first time they appear — every one of them is explained in the
Glossary at the end. If a sentence confuses you, check the glossary first: it's probably one word, not the whole idea. Work
the stages in order; each ends with a checkpoint that proves it works.
Contents
Goal & purpose .........................................................................1
The big idea in 60 seconds ................................................... 2
Tools — pick one lane ............................................................ 2
The task — six stages ............................................................ 2
Bonus stage — the AI rematch............................................. 6
Requirements & stretch goals ............................................... 6
Done means ............................................................................. 7
Curated resources .................................................................. 8
Glossary ...................................................................................12
1 · Goal & purpose
Goal: build a small API that manages a to-do list: you can create tasks, read them, update them, and delete them —
the four CRUD operations. You will see and test your API in a visual page called Swagger UI, and publish everything to
GitHub.
In the lecture you watched the request → response loop from the outside. Now you build the server side of it yourself. CRUD
is the heartbeat of almost every backend in the world — a social network CRUDs posts, a shop CRUDs orders, FlyRank
CRUDs SEO reports. Once you've built CRUD once, every backend you ever meet will feel familiar.
Two habits start here: your data lives only in memory (no database yet — that's next week, and losing your data on restart
is a lesson, not a bug), and everything is submitted through GitHub (that's how all work in this program is shared).
Beginners usually overthink this. The whole thing is under 100 lines of code, built in small stages. You never write more than
~15 lines before you can test again.
1.
2.
3.
4.
5.
6.
7.
8.
9.
2 · The big idea in 60 seconds
Your API is a server — a program that waits for requests and sends back responses. It offers several endpoints. An
endpoint is one "door" into your server, defined by two things:
a path — where the door is, like /tasks or /tasks/3
an HTTP method — what kind of knock it answers to: GET (give me), POST (create this), PUT (replace this), DELETE
(remove this)
So GET /tasks ("give me all tasks") and POST /tasks ("create a task") are two different endpoints, even though the
path is the same. The four CRUD operations map onto the methods like this:
CRUD operation HTTP method Example endpoint Meaning
Create POST POST /tasks Add a new task
Read GET GET /tasks · GET /tasks/3 List all tasks / get task 3
Update PUT PUT /tasks/3 Change task 3
Delete DELETE DELETE /tasks/3 Remove task 3
That table is the assignment. Everything below just builds it, one row at a time.
3 · Tools — pick ONE lane
Both lanes build exactly the same API. Pick the language you want to stick with; don't switch mid-assignment.
JavaScript lane Python lane
Language Node.js (free, nodejs.org) Python 3.10+ (free, python.org)
Framework Express — Hello world FastAPI — First steps
Swagger UI Add with swagger-ui-express (Stage 5) Built in at /docs — zero setup
Testing your API curl + browser + Hoppscotch (all free) same
Publishing Git + a free GitHub account same
Not sure? If you liked the JS 101 session, take the JavaScript lane. If Python feels friendlier, take the Python lane — you'll get
Swagger for free, which is a nice reward.
4 · The task — six stages (+ one bonus)
Work stage by stage, in order. Each stage ends with a checkpoint: a command you run to prove it works. Commit to Git after
every stage (that's your ≥6 commits, honestly earned). If you only finish Stage 3, submit anyway — a working half is worth
more than a broken whole.
1.
2.
FlyRank Internship · Backend Track · W2 · A1 Page 2 of 13
~30 min
~45 min
~1 h
0 Hello, server
The scene: before a restaurant serves food, the doors have to open.
Install your lane's tools (Node or Python — see Resources §6).
Follow your framework's official hello-world page (linked in the table above) to start a server on localhost —
Express on port 3000, FastAPI on port 8000.
Visit it in your browser. You should see your hello message.
C H E C K P O I N T — curl -i http://localhost:3000/ (or :8000/ ) returns status code 200 and your message.
Commit: Stage 0: hello server
1 Your first real endpoint
Every API needs a front door that says what it is.
Add the endpoint GET / returning JSON that describes your API:
{ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] }
Add GET /health returning { "status": "ok" } . Real companies use exactly this endpoint to check a server
is alive — you've just built your first professional habit.
C H E C K P O I N T — both URLs return JSON in the browser and via curl.
Commit: Stage 1: root and health endpoints
2 Read: list and single task
Now the shelves. Your "database" is just a list in your code.
Near the top of your file, create an in-memory list of task objects, pre-filled with 3 example tasks. Each task has:
id (number), title (text), done (true/false).
Add GET /tasks — returns the whole list.
Add GET /tasks/:id (Express) / GET /tasks/{id} (FastAPI) — returns one task. The id part is a path
parameter: a piece of the URL that changes.
If no task has that id, return status 404 with a JSON error: { "error": "Task 99 not found" } . Never return
an empty 200 for something that doesn't exist — status codes are how machines read your answers.
C H E C K P O I N T — curl -i http://localhost:3000/tasks/1 → 200 + one task · curl -i http://
localhost:3000/tasks/99 → 404 + error JSON.
Commit: Stage 2: read endpoints with 404
1.
2.
3.
1.
2.
1.
2.
3.
4.
FlyRank Internship · Backend Track · W2 · A1 Page 3 of 13
~1 h
~1 h
3 Create: POST a new task
A customer walks in with a new order.
Add POST /tasks . The client sends the new task as JSON in the request body:
{ "title": "Buy milk" }
Your server: gives it the next free id , sets done to false , adds it to the list, and returns the created task with
status 201 ("Created" — the polite way to say "done, here's your receipt").
Validate the input: if title is missing or empty, return 400 ("Bad Request") with a JSON error saying what's
wrong. This is your first business rule — the server never trusts the client.
C H E C K P O I N T —
curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d
'{"title":"Buy milk"}'
returns 201 + the new task, and a second GET /tasks shows it in the list. Posting {} returns 400 .
Commit: Stage 3: create with validation
4 Update & Delete
Orders change, orders get cancelled.
Add PUT /tasks/:id — replaces a task's title and/or done with what's in the request body. Returns the
updated task. Unknown id → 404 . Empty/invalid body → 400 .
Add DELETE /tasks/:id — removes the task. Return status 204 ("No Content" — success, nothing to say)
with an empty body. Unknown id → 404 .
Stop and notice: you have built a complete CRUD API. Every backend you'll ever work on is this, wearing more
clothes.
C H E C K P O I N T — create a task, update it, mark it done, delete it, and confirm with GET /tasks — all via curl, all with the
right status codes ( 201 , 200 , 204 , 404 ).
Commit: Stage 4: full CRUD
1.
2.
3.
1.
2.
3.
FlyRank Internship · Backend Track · W2 · A1 Page 4 of 13
~1–1.5 h
~1 h
optional · as many or as few as you like
5 See it: Swagger UI
So far you've imagined your API. Now look at it.
Swagger UI is a web page that reads a description of your API (an OpenAPI file) and turns it into interactive
documentation: every endpoint listed, with a Try it out button that sends real requests — curl with a friendly face.
Python lane: open http://localhost:8000/docs . It's already there — FastAPI generates it from your code.
Add a one-line description to each endpoint (see First steps) and watch the page improve.
JavaScript lane: install swagger-ui-express , write a small openapi.json describing your five task endpoints
(the package README shows the wiring; OpenAPI basic structure explains the file). Serve it at /docs . Describing
endpoints you already built teaches you more than building them did.
Then, in Swagger UI, without curl: create a task, list tasks, update it, delete it.
C H E C K P O I N T — /docs shows all your endpoints; "Try it out" works for the full CRUD cycle. Take a screenshot for your
README.
Commit: Stage 5: Swagger UI
6 Publish to GitHub
Your work only counts when someone else can run it.
Create a public GitHub repo and push your code (your ≥6 stage commits come with it).
Write a README with: what this is, how to install & run it (one documented command), a table of all endpoints, one
pasted curl -i output, and your Swagger screenshot.
New to Git? The basics are all you need here: init → add → commit → push — see Resources §9. And don't
worry: next week's live session covers Git & GitHub properly — branches, pull requests, and how teams review work.
C H E C K P O I N T — a stranger with your README could run your API in under 5 minutes.
Commit: Stage 6: publish and docs — then push everything.
★ Make it yours — optional extras
No database yet — so let's have fun with what memory can do.
None of these are required. Pick whatever sounds fun (creative alternatives welcome):
Filtering with query parameters: GET /tasks?done=true returns only finished tasks. A query parameter is the
part after ? — filters, not addresses.
Search: GET /tasks?search=milk returns tasks whose title contains the word.
A stats endpoint: GET /stats → { "total": 7, "done": 3, "open": 4 } — your first taste of the server
computing something instead of just storing it.
Seed & reset: POST /reset restores the 3 example tasks. Handy for demos — and for the next point.
The mortality experiment: create a few tasks, restart your server, GET /tasks . Write two sentences in your
README about what happened and why. This observation is the entire reason Week 3 exists.
Commit (if you build any): Extras: <what you added>
•
•
1.
2.
•
•
•
•
•
FlyRank Internship · Backend Track · W2 · A1 Page 5 of 13
~1 h · optional — and the most fun
5 · Bonus stage — the AI rematch
7 The AI rematch
You built this API by hand, line by line. Now hire the fastest junior developer on Earth — and review their work.
You did Stages 0–6 by hand for a reason: you now know exactly what "correct" looks like. That knowledge is what
turns this stage from a magic show into a code review.
Write the prompt yourself — this is the real exercise. Without copying text from this document, write your own
prompt asking an AI assistant (Claude, ChatGPT, Gemini — any) to build the same API. From memory, try to
specify everything that matters: language and framework, the five endpoints, status codes, validation rules, inmemory storage, Swagger UI. Describing a system precisely is a core backend skill — you'll meet it again in Week
7's spec-first build.
Generate in quarantine. Put the AI's code in a separate folder ( ai-version/ ) or a branch. Your Stages 0–6 code
stays untouched — that is your hand-built submission, and it must stay hand-built.
Run it. Does it start on the first try? Fire your Stage 4 checkpoint curls at it. Which pass? Which fail?
Diff it. Compare the AI's code with yours side by side ( git diff --no-index your-file ai-file works on
any two files). Then answer three questions in a short "AI vs me" section of your README:
What did the AI do better — and do you understand its version well enough to explain it?
What did it get wrong or quietly ignore from your prompt? (A missing 400 ? A wrong status code? A database
you never asked for?)
What did your prompt forget to specify — and what did the AI silently decide for you?
One rematch. Improve your prompt with what you learned, regenerate, and note in one sentence what changed.
The lesson hiding in this stage: an AI's output is exactly as good as your specification — and you could only judge it
because you had built the thing yourself first. Both halves of that sentence are your career from now on.
C H E C K P O I N T — your README has an "AI vs me" section containing your full prompt and at least three concrete
differences you found.
Commit: Stage 7: AI vs me (AI code stays in its own folder/branch).
6 · Requirements
Done = every box ticked. Each one is checkable in under a minute.
1.
2.
3.
4.
◦
◦
◦
5.
Server starts with one documented command on localhost.
GET /tasks , GET /tasks/:id , POST /tasks , PUT /tasks/:id , DELETE /tasks/:id all work — full CRUD on
an in-memory list (no database, no files).
Correct status codes: 200 reads, 201 create, 204 delete, 400 invalid body, 404 unknown id — each error with a
JSON error message.
POST and PUT validate input (missing/empty title → 400 ).
Swagger UI at /docs lists every endpoint, and the full CRUD cycle works via "Try it out".
Public GitHub repo, ≥6 meaningful commits (one per stage), README with run instructions, endpoint table, one
curl -i output, and the Swagger screenshot.
FlyRank Internship · Backend Track · W2 · A1 Page 6 of 13
Stretch (optional)
7 · Done means
The full CRUD cycle works twice: once via curl -i (right status codes visible), once via Swagger UI "Try it out".
Your repo is public, the README works on a clean machine, and git log shows one honest commit per stage.
