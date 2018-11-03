- scrape multiple website article comment sections and create a data structure like the following:

```
const commentsBySource = [
  {source01: [comment1, comment2, ...]},
  {source02: [comment1, comment2, ...]},
]
```

- run sentiment analysis on each source and return an aggregate score
