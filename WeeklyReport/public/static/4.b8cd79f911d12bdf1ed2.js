webpackJsonp([4],{1319:function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function i(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0}),e.Post=void 0;var u=(n(154),n(153)),l=o(u),s=(n(115),n(92)),c=o(s),p=(n(114),n(113)),f=o(p),d=(n(257),n(256)),y=o(d),g=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),h=n(0),m=o(h),_=n(5),b=o(_),v=n(48),k=n(59),E=(n(70),n(1344)),P=o(E),C=n(151),j=o(C),w=n(255),A=e.Post=function(t){function e(){var t,n,o,i;r(this,e);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=o=a(this,(t=e.__proto__||Object.getPrototypeOf(e)).call.apply(t,[this].concat(l))),o.handleMenuClick=function(t){o.getPostList({page:1,type:t.key})},o.handleTableChange=function(t){var e=o.props.post.get("posttype");o.getPostList({page:t.current,type:e})},i=n,a(o,i)}return i(e,t),g(e,[{key:"componentDidMount",value:function(){var t=this.props.post.get("posttype");this.getPostList({page:1,type:t})}},{key:"getCloums",value:function(){return this.props.post.get("posttype"),[{title:"页面标题",dataIndex:"post_title",key:"title",render:function(t,e){return m.default.createElement("a",{href:"/post/"+e._id+".html",target:"_blank"},t)}},{title:"发布人",dataIndex:"post_author",key:"author",render:function(t){return t?m.default.createElement("span",null,t.userName):m.default.createElement("span",null,"未找到")}},{title:"当前分类",dataIndex:"post_term",key:"term",render:function(t){return m.default.createElement(y.default,{color:"#87d068"},t.term_name)}},{title:"当前状态",width:90,dataIndex:"post_status",key:"status",render:function(t){var e={"-1":{color:"#f50",content:"已删除"},1:{color:"#87d068",content:"已发布"},0:{color:"#108ee9",content:"草稿"}};return m.default.createElement("span",{style:{color:e[t].color}},e[t].content)}},{title:"发布时间",dataIndex:"post_date",key:"date",render:function(t){return(0,w.dateToString)(t)}},{title:"修改时间",dataIndex:"post_modified",key:"modify",render:function(t){return(0,w.dateToString)(t)}},{title:"操作",key:"handle",render:function(t,e,n){return m.default.createElement("span",null,m.default.createElement("a",{href:"/post/"+e._id+".html",target:"_blank"},"查看"))}}]}},{key:"getPostList",value:function(t){var e=this.props,n=e.appActions,o=e.postActions;n.loading(!0).then(function(){return o.getList(t)}).then(function(){n.loading(!1)}).catch(function(t){f.default.error(t.msg)})}},{key:"render",value:function(){var t=this.props.post,e=t.get("posttype")||"post",n=t.get("postlist")&&t.get("postlist").toArray(),o=t.get("pagination")&&t.get("pagination").toJS(),r=this.getCloums();return m.default.createElement("div",null,m.default.createElement(c.default,{onClick:this.handleMenuClick,selectedKeys:[e],mode:"horizontal"},m.default.createElement(c.default.Item,{key:"post"},"文章列表"),m.default.createElement(c.default.Item,{key:"trash",style:{marginLeft:20}},"回收站文章")),m.default.createElement(l.default,{bordered:!0,rowKey:"_id",columns:r,dataSource:n,className:"mt20",pagination:o,onChange:this.handleTableChange}))}}]),e}(h.Component);A.propTypes={post:b.default.object,appActions:b.default.object,postActions:b.default.object},e.default=(0,v.connect)(function(t){return{post:t.get("post")}},function(t){return{postActions:(0,k.bindActionCreators)(P.default,t),appActions:(0,k.bindActionCreators)(j.default,t)}})(A)},1344:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(152),r=function(t){return t&&t.__esModule?t:{default:t}}(o),a=function(t){return function(e){return r.default.get("/api/posts/list",t).then(function(n){return Promise.resolve(e({type:"post_list",posttype:t.type,pagination:n.data.pagination,postlist:n.data.results}))})}};e.default={getList:a}}});
//# sourceMappingURL=map/4.b8cd79f911d12bdf1ed2.js.map