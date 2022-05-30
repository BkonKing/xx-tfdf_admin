// import {
//   userApi
// } from '@/api/user'
// import {
//   asyncRoutes
// } from '@/router'

// const setMenu = (data) => {
//   return data.map(obj => {
//     delete obj.component
//     if (obj.children && obj.children.length) {
//       obj.children = setMenu(obj.children)
//     }
//     return obj
//   })
// }

// export const UserMenu = [
//   RegExp(userApi.UserMenu),
//   'get',
//   {
//     code: '200',
//     success: true,
//     message: 'OK',
//     data: setMenu(asyncRoutes)
//   }
// ]
