import React from 'react'
import { useRoutes } from 'react-router-dom'
import { router } from '../../router/index.js'

export default function AllRouter() {
  const element = useRoutes(router)
  return <>{element}</>
}
