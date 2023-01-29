import { ServiceInsance } from './src/instence'
const server = new ServiceInsance({
  timeout: 2000,
})
server.get('www.baidu.com').then((res) => {
  console.log(res)
})
