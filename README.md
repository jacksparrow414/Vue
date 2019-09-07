# Vue
## 项目简介：
1. 此项目是graintBaby项目的前端部分，后端代码可参阅[这里](https://github.com/jacksparrow414/griantBaby)。
2. 此项目主要是在[VueAdmin](https://panjiachen.github.io/vue-element-admin-site/zh/)上进行改造，结合ElementUI进行改造
3. 前后端交互方式不再通过ajax，而是通过**axios**进行
## 项目结构：
直接参考VueAdmin官方文档即可
## 建议：
1. 由于VueAdmin是一个单纯的前端项目，所有数据均为Mock数据，为提供详细前后端交互代码，可参考本项目改造部分进行前后端交互
2. 若要自行改造，强烈建议，先把**permission.js**、**store**、**utils**下的代码看懂，否则前后端交互关于token以及权限的校验部分会看不懂
