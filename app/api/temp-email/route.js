import { NextResponse } from "next/server"

const BASE = "https://www.1secmail.com/api/v1"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")
  const login = searchParams.get("login")
  const domain = searchParams.get("domain")
  const id = searchParams.get("id")

  try {
    if (action === "genRandomMailbox") {
      const res = await fetch(`${BASE}/?action=genRandomMailbox&count=1`)
      const data = await res.json()
      return NextResponse.json(data)
    }

    if (action === "getMessages" && login && domain) {
      const res = await fetch(
        `${BASE}/?action=getMessages&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}`
      )
      const data = await res.json()
      return NextResponse.json(data)
    }

    if (action === "readMessage" && login && domain && id) {
      const res = await fetch(
        `${BASE}/?action=readMessage&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}&id=${encodeURIComponent(id)}`
      )
      const data = await res.json()
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 })
  } catch (err) {
    console.error("Temp email API proxy error:", err)
    return NextResponse.json({ error: "Proxy request failed" }, { status: 502 })
  }
}
