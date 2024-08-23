## transfer-virtual
**简介**：本内容主要是基于el-transfer的虚拟化列表优化，[element官方文档](https://element-plus.org/zh-CN/component/transfer.html)，其中在查看虚拟化树形控件（tree-v2）时发现自带的虚拟化列表[virtual-list](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Felement-plus%2Felement-plus%2Fblob%2Fmain%2Fpackages%2Fcomponents%2Fvirtual-list%2Findex.ts "https://github.com/element-plus/element-plus/blob/main/packages/components/virtual-list/index.ts")中的FixedSizeList

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/2595fa6df63e404e96ceac3bbc81eaef~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oan5oas5oOz5YGa55m95pel5qKm:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjc0MDQ2MTYzMTcwOTYxNCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724488518&x-orig-sign=fQGdaLmoWYcwIltU6OlydOp631c%3D)
1.增加**itemSize**、**height**参数，用于虚拟列表高度计算渲染,其余使用参数请参考官方文档

   itemSize：每条数据高度
   
   height：列表高度
   
2.基于通已灵码优化部分代码，主要涉及文件use-check、use-computed-data、use-move



