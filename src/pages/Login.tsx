import { useState } from "react"
import { supabase } from "../lib/supabase"
import type { AuthError } from "@supabase/supabase-js"
import { FaGoogle, FaGithub, FaDiscord } from "react-icons/fa"
import * as React from "react"

export default function Login() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async (provider: "google" | "github" | "discord") => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      const authError = error as AuthError
      console.error("Error:", authError)
      alert(authError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 py-2">
      <div className="rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-800">Iniciar sesión</h1>
        <div className="space-y-4">
          <button
            onClick={() => handleLogin("google")}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
          >
            <FaGoogle className="mr-2" />
            Iniciar sesión con Google
          </button>
          <button
            onClick={() => handleLogin("github")}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-900 disabled:opacity-50"
          >
            <FaGithub className="mr-2" />
            Iniciar sesión con GitHub
          </button>
          <button
            onClick={() => handleLogin("discord")}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            <FaDiscord className="mr-2" />
            Iniciar sesión con Discord
          </button>
        </div>
      </div>
    </div>
  )
}

