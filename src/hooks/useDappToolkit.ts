import { useContext } from 'react'
import { RadixContext } from '../contexts/rdt-context'

export const useDappToolkit = () => useContext(RadixContext)!
