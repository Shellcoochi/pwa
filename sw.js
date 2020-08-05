const CACHE_NAME = "pwa";//定义缓存名称
self.addEventListener("install",event=>{
    self.skipWaiting()//跳过等待
})
self.addEventListener("activate",event=>{
    clients.claim();//立即受控
})
//网络层拦截图片
// self.addEventListener('fetch',event=>{
//     if(/network\.jpg$/.test(event.request.url)){
//         return event.respondWith(fetch("images/pwa.jpg"));
//     }
// })
//定制404页面
// self.addEventListener('fetch',event=>{
//     if(event.request.mode == "navigate"){
//         return event.respondWith(
//             fetch(event.request).then(res=>{
//                 if(res.status == 404){
//                     return fetch("custom404.html");
//                 }
//                 return res;
//             })
//         )
//     }
// })
//离线可用
self.addEventListener('install',event=>{
    self.skipWaiting();
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache=>{
          cache.addAll([
              //在安装Service Worker时，将相关资源进行缓存
              "images/network.jpg",
              "custom404.html",
              "/",
              "index.html"
          ])
      })
    );
})
self.addEventListener("fetch",event=>{
    return event.respondWith(
        fetch(event.request)
            .then(res=>{
                if(event.request.made == "navigate" && res.status == 404){
                    return fetch("custom404.html")
                }
                return res;
            })
            .catch(()=>{
                //离线状态下的处理
                return caches.open(CACHE_NAME).then(cache=>{
                    //从cache离main取资源
                    return cache.match(event.request).then(response=>{
                        if(response){
                            return response;
                        }
                        return cache.match("custom404.html");
                    })
                })
            })
    )
})