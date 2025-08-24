# REST API endpoints Documentation

## MOVIES Application API
**version:** `1.0.0`

**base URL:** `api/v1/`

---

## MOVIE class views
### LIST movies view endpoints
`GET api/v1/movies/`  
returns a list of all movies (defaults to summary detail fields)

`GET api/v1/movies/?detail=full`  
returns a list of all movies with full detail fields

`POST api/v1/movies/`  
creates a new movie  

**query parameters:**
- `detail`*(string, optional, default=`summary`)*  
  - `full` - response includes all movie detail fields  
    - **uses:** `MovieSerializer`  
  - `summary` - response includes only basic fields  
    - **uses:** `MovieListSerializer`   
---
### DETAIL movie view endpoints
`GET api/v1/movies/{id}/`  
returns a single movie (defaults to summary detail fields)

`GET api/v1/movies/{id}/?detail=full`  
returns a single movie with full detail fields

`PATCH api/v1/movies/{id}/`  
partially updates a movie

`PUT api/v1/movies/{id}/`  
fully updates a movie

`DELETE api/v1/movies/{id}/`  
deletes a movie

**query parameters:**
- `detail`*(string, optional, default=`summary`)*  
  - `full` - response includes all movie detail fields  
    - **uses:** `MovieSerializer`  
  - `summary` - response includes only basic fields  
    - **uses:** `MovieListSerializer`  
---
### SEARCH movies view endpoint
`GET api/v1/movies/search/?search={query}`  
returns a list of movies matching the search query (case-insensitive, matches title)

**query parameters:**
- `search`*(string, optional)*  
  - when provided, returns movies whose titles contain the search value  
  - when empty, returns all movies
  (temporary behavior may change later)
---
## GENRE class views
### LIST genres view endpoints
`GET api/v1/genres/`  
returns a list of all genres (default: basic fields)

`GET api/v1/genres/?include_count=true`  
returns a list of all genres with the number of movies in each genre

`POST api/v1/genres/`  
Creates a new genre

**query parameters:**
- `include_count` *(boolean, optional, default=`false`)*  
  - `true` — include the number of movies related to each genre  
    - **uses:** `GenreMovieCountSerializer`  
  - `false` — returns basic genre fields only  
    - **uses:** `GenreSerializer`
---
### DETAIL genre view endpoints
`GET api/v1/genres/{id}/`  
returns a single genre (default: basic fields)

`GET api/v1/genres/{id}/?include_count=true`  
returns a single genre with the number of movies in it

`PATCH api/v1/genres/{id}/`  
partially updates a genre

`PUT api/v1/genres/{id}/`  
fully updates a genre

`DELETE api/v1/genres/{id}/`  
deletes a genre

**query parameters:**
- `include_count` *(boolean, optional, default=`false`)*  
  - `true` — include the number of movies related to the genre  
    - **uses:** `GenreMovieCountSerializer`  
  - `false` — returns basic genre fields only  
    - **uses:** `GenreSerializer`
---
### GENRE movies view endpoints
`GET api/v1/genres/{id}/movies/`  
returns a list of movies under a specific genre (default: summary fields)

**query parameters:**
- `limit` *(integer, optional, default=`5`)*  
  - maximum number of movies to return (max=50)
- `include_inactive` *(boolean, optional, default=`false`)*  
  - include inactive movies if `true`
- `detail` *(string, optional, default=`summary`)*  
  - `summary` — basic movie fields  
    - **uses:** `GenreMovieRelatedSerializer`  
  - `full` — full movie details  
    - **uses:** `MovieSerializer`