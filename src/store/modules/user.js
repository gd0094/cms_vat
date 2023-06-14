import { login, getInfo,logout} from '@/api/system/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { getUserInfo, updateUserInfo } from '@/api/system/user'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    // 角色
    roles: [],
    // 权限
    authorities: [],
    phone: '',
    password: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_AUTHORITIES:(state,data) => {
    state.authorities=data
  },
  SET_PHONE:(state,phone) => {
    state.phone=phone
  },
  SET_PASSWORD: (state, password) => {
    state.password = password
  },
  UPDATEUSERINFO:(state, name, phone, avatar ) => {
    console.log(avatar)
    state.name = name
    state.phone = phone
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data,headers} = response
        const token=headers.authorization
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info 
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        if (!res.data.data) {
          return reject('获取用户信息失败')
        }
        const phone = res.data.data.phone
        const password = res.data.data.password
        const avatar = res.data.data.avatar
        commit('SET_PHONE', phone)
        commit('SET_PASSWORD', password)
        commit('SET_AVATAR', avatar)
      })
      getInfo().then(res => {
        const { data } = res.data
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        console.log(res.data)
        const { name, avatar,authorities,roles } = data
        commit('SET_NAME', name)
        commit('SET_AUTHORITIES',authorities)
        commit('SET_ROLES',roles)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },


  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // 修改用户信息
  async updateUserInfo({commit}, userInfo){
    return new Promise((resolve, reject) => {
      console.log(userInfo)
      updateUserInfo(userInfo).then(res => {
        if(res.data.code != 200) {
          return reject('更新用户信息失败')
        }else{
          getUserInfo().then(res => {
            console.log('重新获取用户信息', res.data.data)
            const { nickName, avatar, phone } = res.data.data
            commit('SET_NAME', nickName)
            commit('SET_AVATAR', avatar)
            commit('SET_PHONE', phone)
            resolve()
          }).catch(error => {
            reject(error)
          })
        }
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

