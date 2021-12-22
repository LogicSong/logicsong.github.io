import{g as n,f as s,G as a}from"./common-bec3f312.js";const p='{"title":"浅析深拷贝","frontmatter":{"date":"2021-03-17","title":"浅析深拷贝","tags":[2021,"js进阶"],"describe":"深拷贝看似简单，实际上要实现一个完善的深拷贝是很复杂的，本文实现了一个简单的深拷贝函数。"},"headers":[{"level":3,"title":"你真的理解深拷贝吗？","slug":"你真的理解深拷贝吗？"},{"level":3,"title":"乞丐版","slug":"乞丐版"},{"level":3,"title":"基础版本","slug":"基础版本"},{"level":3,"title":"解决循环引用的版本","slug":"解决循环引用的版本"},{"level":3,"title":"还有哪些问题？","slug":"还有哪些问题？"}],"relativePath":"docs/deepCopy.md","lastUpdated":1639996524456.0002}';var t={};const o=a('<h3 id="你真的理解深拷贝吗？"><a class="header-anchor" href="#你真的理解深拷贝吗？" aria-hidden="true">#</a> 你真的理解深拷贝吗？</h3><p>先看看深拷贝和浅拷贝的定义：</p><p>浅拷贝：</p><blockquote><p>创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。</p></blockquote><p>深拷贝：</p><blockquote><p>将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且修改新对象不会影响原对象。</p></blockquote><p>下面来一步步实现一个有些意思的深拷贝。</p><h3 id="乞丐版"><a class="header-anchor" href="#乞丐版" aria-hidden="true">#</a> 乞丐版</h3><div class="language-js"><pre><code><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><p>能够应付大部分场景，但缺点是：</p><ol><li><p>不能copy函数</p></li><li><p>不能拷贝Date等对象</p></li><li><p>拷贝循环引用时会报错</p></li></ol><h3 id="基础版本"><a class="header-anchor" href="#基础版本" aria-hidden="true">#</a> 基础版本</h3><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">deepCopy</span><span class="token punctuation">(</span><span class="token parameter">source</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> source <span class="token operator">!==</span> <span class="token string">&#39;object&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">let</span> target <span class="token operator">=</span> Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>source<span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span> <span class="token comment">// 兼容数组</span>\n        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">const</span> key <span class="token keyword">in</span> source<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            target<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">deepCopy</span><span class="token punctuation">(</span>source<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">return</span> target<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token punctuation">{</span>\n        <span class="token keyword">return</span> source<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><h3 id="解决循环引用的版本"><a class="header-anchor" href="#解决循环引用的版本" aria-hidden="true">#</a> 解决循环引用的版本</h3><p>复制循环引用的问题是因为递归进入死循环导致栈溢出，解决思路是将每一次复制的内容保存起来，复制时去查找之前是不是已经复制过，如果复制过就用已经复制的值。</p><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">deepCopy</span><span class="token punctuation">(</span>source<span class="token punctuation">,</span> map <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> source <span class="token operator">===</span> <span class="token string">&#39;object&#39;</span> <span class="token operator">&amp;&amp;</span> source <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">let</span> target <span class="token operator">=</span> Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>source<span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>\n        <span class="token keyword">const</span> oldValue <span class="token operator">=</span> map<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>source<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>oldValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">return</span> oldValue<span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">const</span> key <span class="token keyword">in</span> source<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            target<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">deepCopy</span><span class="token punctuation">(</span>source<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">,</span> map<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        map<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>source<span class="token punctuation">,</span> target<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span> target<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token punctuation">{</span>\n        <span class="token keyword">return</span> source<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><h3 id="还有哪些问题？"><a class="header-anchor" href="#还有哪些问题？" aria-hidden="true">#</a> 还有哪些问题？</h3><ul><li>对于函数，直接返回的原始引用，这是因为克隆函数是没什么意义的，包括lodash中也是直接返回的，如果真要写的话可以参考以下：</li></ul><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">cloneFunction</span><span class="token punctuation">(</span><span class="token parameter">func</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> funcString <span class="token operator">=</span> func<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>func<span class="token punctuation">.</span>prototype<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 普通函数</span>\n        <span class="token keyword">const</span> paramReg <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">(?&lt;=\\().+(?=\\)\\s+{)</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">;</span>\n        <span class="token keyword">const</span> bodyReg <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">(?&lt;={)(.|\\n)+(?=})</span><span class="token regex-delimiter">/</span><span class="token regex-flags">m</span></span><span class="token punctuation">;</span>\n        <span class="token keyword">const</span> param <span class="token operator">=</span> paramReg<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span>funcString<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">const</span> body <span class="token operator">=</span> bodyReg<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span>funcString<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>body<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token comment">// console.log(&#39;匹配到函数体：&#39;, body[0]);</span>\n            <span class="token keyword">if</span> <span class="token punctuation">(</span>param<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n                <span class="token keyword">const</span> paramArr <span class="token operator">=</span> param<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">&#39;,&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token comment">// console.log(&#39;匹配到参数：&#39;, paramArr);</span>\n                <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Function</span><span class="token punctuation">(</span><span class="token operator">...</span>paramArr<span class="token punctuation">,</span> body<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n                <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Function</span><span class="token punctuation">(</span>body<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n            <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 箭头函数</span>\n        <span class="token keyword">return</span> <span class="token function">eval</span><span class="token punctuation">(</span>funcString<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div>',19);t.render=function(a,p,t,e,c,u){return s(),n("div",null,[o])};export default t;export{p as __pageData};
