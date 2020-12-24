import './App.css';
import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container'
import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import db from './firebase'
import DeleteIcon from '@material-ui/icons/Delete';
import firebase from 'firebase'
import { Table, TableCell, TableContainer, TableBody, TableHead, TableRow } from '@material-ui/core'


function App() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [isbn, setISBN] = useState('')
  const [msg, setMsg] = useState('')
  const [notification, setNotification] = useState(false)
  const [severity, setSeverity] = useState('')
  const [books, setBooks] = useState([])
  const booklists = books.map(book => ({
    id: book.id,
    title: book.book.title,
    author: book.book.author,
    isbn: book.book.isbn
  }))


  const handler = async (e) => {
    e.preventDefault()

    if (!title || !author || !isbn) {
      setSeverity('error')
      setMsg('Please fill in all field')
      setNotification(true)
    } else {
      try {
        await db.collection('books').add({
          title: title,
          author: author,
          isbn: isbn,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        setSeverity('success')
        setMsg('Book added')
        setNotification(true)

      } catch {
        setSeverity('error')
        setMsg('Cannot add book')
        setNotification(true)
      }
    }
    setTitle(''); setAuthor(''); setISBN('')
  }

  useEffect(() => {
    db.collection('books')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setBooks(snapshot.docs.map(doc => ({ id: doc.id, book: doc.data() })))
      });
  }, [])

  const deleteButton = async (e) => {
    const ID = e.currentTarget.id
    try {
      await db.collection('books').doc(ID).delete()
      setSeverity('warning')
      setMsg('Book remove')
      setNotification(true)
    } catch {
      setSeverity('error')
      setMsg('Cannot delete')
      setNotification(true)
    }
  }

  const handle = () => {
    setNotification(false)
  }

  if (notification) {
    setTimeout(handle, 3000)
  }

  return (
    <div className="App">
      <Container maxWidth="lg">
        <h1>Book<span>List</span> App</h1>

        <form onSubmit={handler} className="App__form">
          <label >Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} />

          <label >Author</label>
          <input type="text" value={author} onChange={e => setAuthor(e.target.value)} />

          <label >ISBN</label>
          <input type="text" value={isbn} onChange={e => setISBN(e.target.value)} />

          <Button type="submit" variant="contained" color="secondary">Add Book</Button>

          <div className="App__form__notification">
            {notification && <Alert variant="filled" severity={severity}>{msg}</Alert>}
          </div>
        </form>

        <div className="App__table">
          <TableContainer >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Author</strong></TableCell>
                  <TableCell><strong>ISBN#</strong></TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {booklists.map(booklist => (
                  <TableRow id="gg" key={booklist.id}>
                    <TableCell align="left">{booklist.title}</TableCell>
                    <TableCell align="left" >{booklist.author}</TableCell>
                    <TableCell align="left">{booklist.isbn}</TableCell>
                    <TableCell align="right">
                      <Button id={booklist.id} onClick={deleteButton}>
                        <DeleteIcon color="primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </TableContainer>

        </div>

      </Container>
    </div >
  );
}

export default App;
