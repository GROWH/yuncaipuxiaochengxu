// 连接数据库
const db = wx.cloud.database();
// 添加的方法
const add =(table,data)=>{
    // 是一个promise对象，所以要return
   return db.collection(table).add({
        data
    })
}

// 查询单个
const findOne=(table,_id)=>{
    return db.collection(table)
    .doc(_id)
    .get()
}

// 查询
const find=(table,where={})=>{
    return db.collection(table)
    .where(where)
    .get()
}

// 从数据库查询所有
const findAll=async (table,where={})=>{
  const MAX_LIMIT = 1
     // 先取出集合记录总数
  const countResult = await db.collection(table).where(where).count()
  const total = countResult.total
  if(total==0){
      return {
          data:[]
      }
  }
  // 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(table)
    .where(where)
    .skip(i * MAX_LIMIT).limit(MAX_LIMIT)
    .get()
    tasks.push(promise)
  }
//   let res = await Promise.all(tasks)
//   console.log(res);

// 等待所有
return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
    }
  })
}

const findByPage=(table,where={},page=1,limit=10,order={filed:'_id',sort:'asc'})=>{
    // asc:正序  desc：倒序
    // 偏移量=（页数-1）*每页显示的条数
    // 1       0
    // 2       6
    // 3       12
    // 4       18
    let start = (page-1)*limit
    return db.collection(table)
    .where(where)
    .skip(start)
    .limit(limit)
    .orderBy(order.filed,order.sort)
    .get()
}

// 删除数据
const remove = (table,_id)=>{
    return db.collection(table)
    // 根据主键进行删除就用doc
    .doc(_id)
    .remove()
}

// 
const removeByWhere=(table,where={})=>{
    return db.collection(table)
    .where(where)
    .remove()
}

// 修改
const updata=(table,_id,data)=>{
   return db.collection(table)
    .doc(_id)
    .update({
        data
    })
}

// 处理上传
const upload=(fileList,dir="x_caipu")=>{
    let tasks = [];
    fileList.forEach(item=>{ 
        let ext = item.url.split(".").pop()
        let filename = (new Date).getTime()+Math.random()+'.'+ext
       let promise= wx.cloud.uploadFile({
            cloudPath: dir+"/"+filename, // 上传至云端的路径
            filePath: item.url, // 小程序临时文件路径
          })
          tasks.push(promise)
    })
    return Promise.all(tasks)
    
}

const _ =db.command



export default{
    add,
    find,
    findAll,
    remove,
    updata,
    upload,
    findOne,
    findByPage,
    _,
    removeByWhere,
    db
}