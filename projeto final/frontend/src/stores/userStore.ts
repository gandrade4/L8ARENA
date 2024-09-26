import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {

  const user = ref<Omit<User, 'password'>>({
    id: Number(localStorage.getItem('id')) || 0,
    name: localStorage.getItem('name') || "",
    username: localStorage.getItem('username') || "",
    email: localStorage.getItem('email') || "",
    role: {
      id: Number(localStorage.getItem('roleId')) || 0,
      name: localStorage.getItem('role') || ""
    }
  })

  const jwt = ref(localStorage.getItem('jwt') || "")

  // Computed properties
  const role = computed(() => user.value.role.name)
  const username = computed(() => user.value.username)
  const isAuthenticated = computed(() => jwt.value !== "")

  // Authenticate user and store in localStorage
  function authenticate(authUser: string, token: string) {
    
    jwt.value = token

    localStorage.setItem("token", token);
    localStorage.setItem("username", authUser);
  }

  // Logout user and clear localStorage
  function logout() {
    jwt.value = ""
    user.value = {
      id: 0,
      name: "",
      username: "",
      email: "",
      role: {
        id: 0,
        name: ""
      }
    }

    localStorage.clear()
  }

  return { user, username, jwt, role, isAuthenticated, authenticate, logout }
})
