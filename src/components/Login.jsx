import { useRef, useState, useEffect, useContext } from 'react'
import useAuth from '../hooks/useAuth.jsx'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from '../lib/axios.js'
const LOGIN_URL = 'login';

const Login = () => {
  // Login design from Dave Gray's Youtube videos called React Persistent User Auth w/ JWT and React Protected Routes | Role-Based Auth| React Router v6
  const { setAuth } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const userRef = useRef()
  const errRef = useRef()

  const [username, setUsername] = useState('')
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [username, pwd])

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username, password:pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          
        }
      )
      const token = response?.data?.token
      const isAdmin = response?.data?.admin
      const user = response?.data?.user
      setAuth({ isAdmin, user, token })
      setUsername('')
      setPwd('')
      navigate(from, { replace: true })
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password')
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized')
      } else {
        setErrMsg('Login Failed')
      }
      errRef.current.focus()
    }
  }
  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? 'errmsg' : 'offscreen'}
        aria-live='assertive'
      >
        {errMsg}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type='text'
          id='username'
          placeholder="Username"
          ref={userRef}
          autoComplete='off'
          onChange={e => setUsername(e.target.value)}
          value={username}
          required
        />
        <input
          type='password'
          id='password'
          placeholder='Password'
          onChange={e => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <button className='login-button'>Sign In</button>
      </form>
    </section>
  )
}

export default Login
