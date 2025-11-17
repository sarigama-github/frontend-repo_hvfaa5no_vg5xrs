import { useEffect, useState } from 'react'
import { api, getToken } from './utils/api'

export default function Test(){
  const [me, setMe] = useState(null)
  const [err, setErr] = useState('')
  useEffect(()=>{
    if(!getToken()) return
    api('/me', {auth:true}).then(setMe).catch(e=>setErr(e.message))
  },[])
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Backend connectivity test</h1>
      <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify({me, err}, null, 2)}</pre>
    </div>
  )
}