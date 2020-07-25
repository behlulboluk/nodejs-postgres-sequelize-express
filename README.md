# Nodejs Express Rest Api 
---
## Prerequisites
- postgresql
- nodejs
- npm

## install
- npm install

## start
- npm start

# Api usage
## Users:
 
>Methods: GET, POST
		
## 1. GET

	- http://localhost:3000/users
		
Response - HTTP 200:

```
{
    "status": "success",
    "message": "Users retrieved",
    "data": [
        {
            "id": 2,
            "name": "Behlül Bahadır Bölük"
        },
        {
            "id": 1,
            "name": "Bahadır Bölük"
        }
    ]
}
```

## 2. GET by id 

- http://localhost:3000/users/${userId}

- http://localhost:3000/users/1


Response - HTTP 200:

```
{
    "status": "success",
    "message": "Found User",
    "data": {
        "id": 1,
        "name": "Bahadır Bölük",
        "books": {
            "past": [
                {
                    "id": 1,
                    "name": "test 1",
                    "userScore": 9
                },
                {
                    "id": 2,
                    "name": "test 2",
                    "userScore": 6
                }
            ],
            "present": [
                {
                    "id": 3,
                    "name": "test 3"
                }
            ]
        }
    }
}
```

## 3. POST

- http://localhost:3000/users

Body:

```
{
    "name": "Behlül Bahadır Bölük"
}
```

required_fields = ["name"]

Response - HTTP 200:

```
{
    "status": "success",
    "message": "User created",
    "data": {
        "id": 1,
        "name": "Behlül Bahadır Bölük"
    }
}
```

## 4. POST - User borrowed a book with userId and bookId

- http://localhost:3000/users/${userId}/borrow/${bookId}

- http://localhost:3000/users/1/borrow/2


Response - HTTP 204 No Content


## 5. POST - User returning a book with his score

- http://localhost:3000/users/${userId}/return/${bookId}

- http://localhost:3000/users/1/return/2

Body:

```
{
    "score": 9
}
```
required_fields = ["score"]

Response - HTTP 204 No content


## Books:
 
>Methods: GET, POST

## 1. GET

	- http://localhost:3000/books
		
Response - HTTP 200:

```
{
    "status": "success",
    "message": "Books retrieved",
    "data": [
        {
            "id": 1,
            "name": "test 1"
        },
        {
            "id": 2,
            "name": "test 2"
        },
        {
            "id": 3,
            "name": "test 3"
        }
    ]
}}
```

## 2. GET by id 

- http://localhost:3000/books/${bookId}

- http://localhost:3000/books/1


Response - HTTP 200:

```
{
    "status": "success",
    "message": "Found Book",
    "data": {
        "id": 1,
        "name": "test 1",
        "score": 7.75
    }
}
```

- Getting a book which is not scored yet

```
{
    "status": "success",
    "message": "Found Book",
    "data": {
        "id": 1,
        "name": "test 1",
        "score": -1
    }
}
```

## 3. POST

- http://localhost:3000/books

Body:

```
{
    "name": "test 3"
}
```

required_fields = ["name"]

Response - HTTP 200:

```
{
    "status": "success",
    "message": "Book created",
    "data": {
        "id": 3,
        "name": "test 3"
    }
}
```

----