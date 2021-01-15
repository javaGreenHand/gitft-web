const table = 'goods'

const wxRequest = (url, query, method) => {
  return new Promise((resolve, reject) => {
    console.log('wxRequest')
    let data = {}
    data.query = query
    let r = c1.callContainer({
      path: '/container-gift-service/wexin' + url, // 填入容器的访问路径
      // 其余参数同 wx.request
      method: method,
      data: data,
      success (res) {
        resolve(JSON.parse(res.data))
      }
    })
  })
}

export const searchGoods = (param) => {
  console.log('searchGoods')
  let url = '/list'
  let query = ''
  if (undefined === param || param === null) {
    query = 'db.collection(\'' + table + '\').count()'
  } else {
    query = 'db.collection(\'' + table + '\').limit(' + param.limit + ').skip(' + param.skip + ').get()'
  }
  return wxRequest(url, query, 'post')
}

export const saveGoods = (data) => {
  let obj = {}
  obj.data = data
  if (undefined === data._id || data._id == null) {
    let url = '/add'
    let query = 'db.collection(\'' + table + '\').add(' + JSON.stringify(obj) + ')'
    return wxRequest(url, query, 'post')
  } else {
    let url = '/update'
    let query = 'db.collection(\'' + table + '\').doc(\'' + data._id + '\').update(' + JSON.stringify(obj) + ')'
    return wxRequest(url, query, 'post')
  }
}

export const deleteGoods = (id) => {
  let url = '/delete'
  let query = 'db.collection(\'' + table + '\').doc(\'' + id + '\').remove()'
  return wxRequest(url, query, 'post')
}
