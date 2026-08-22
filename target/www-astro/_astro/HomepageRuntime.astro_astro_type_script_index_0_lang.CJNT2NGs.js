const Ce="modulepreload",Le=function(e){return"/"+e},he={},be=function(t,s,n){let a=Promise.resolve();if(s&&s.length>0){let l=function(c){return Promise.all(c.map(i=>Promise.resolve(i).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),u=o?.nonce||o?.getAttribute("nonce");a=l(s.map(c=>{if(c=Le(c),c in he)return;he[c]=!0;const i=c.endsWith(".css"),f=i?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${f}`))return;const b=document.createElement("link");if(b.rel=i?"stylesheet":Ce,i||(b.as="script"),b.crossOrigin="",b.href=c,u&&b.setAttribute("nonce",u),document.head.appendChild(b),i)return new Promise((p,w)=>{b.addEventListener("load",p),b.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${c}`)))})}))}function d(l){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=l,window.dispatchEvent(o),!o.defaultPrevented)throw l}return a.then(l=>{for(const o of l||[])o.status==="rejected"&&d(o.reason);return t().catch(d)})},O={"(":")","[":"]","{":"}"},B=new Set(Object.values(O));function R(e,t,s,n,a="end"){e.setRangeText(n,t,s,a),e.dispatchEvent(new Event("input",{bubbles:!0}))}function le(e,t){return e.lastIndexOf(`
`,t-1)+1}function Ae(e,t){return e.slice(le(e,t),t).match(/^\s*/)?.[0]??""}function Re(e,t){const{value:s,selectionStart:n,selectionEnd:a}=e;if(Object.hasOwn(O,t)){const d=O[t];return n!==a?(R(e,n,a,`${t}${s.slice(n,a)}${d}`,"select"),e.setSelectionRange(n+1,a+1)):(R(e,n,a,`${t}${d}`),e.setSelectionRange(n+1,n+1)),!0}if(B.has(t))return n===a&&s[n]===t?e.setSelectionRange(n+1,n+1):R(e,n,a,t),!0;if(t==="Backspace"&&n===a&&n>0&&O[s[n-1]]===s[n])return R(e,n-1,n+1,""),!0;if(t==="Enter"){const l=s.slice(0,n).trimEnd().at(-1),o=Ae(s,n)+(Object.hasOwn(O,l)?"  ":"");return R(e,n,a,`
${o}`),!0}return!1}function Oe(e,t=!1){const{value:s,selectionStart:n,selectionEnd:a}=e;if(!t){R(e,n,a,"  ");return}const d=le(s,n),l=s.indexOf(`
`,a)===-1?s.length:s.indexOf(`
`,a),u=s.slice(d,l).replace(/^ {1,2}/gm,"");R(e,d,l,u,"select"),e.setSelectionRange(d,d+u.length)}function Te(e,t){const s=[];let n=!1,a=!1,d=!1;for(let l=0;l<t;l+=1){const o=e[l];if(a){o===`
`&&(a=!1);continue}if(n){!d&&o==='"'&&(n=!1),d=!d&&o==="\\";continue}if(o===";"){a=!0;continue}if(o==='"'){n=!0,d=!1;continue}Object.hasOwn(O,o)?s.push(o):B.has(o)&&O[s.at(-1)]===o&&s.pop()}return s.length}function Pe(e){const{value:t,selectionStart:s,selectionEnd:n}=e,a=le(t,s),d=t.indexOf(`
`,a)===-1?t.length:t.indexOf(`
`,a),l=t.slice(a,d),o=l.trimStart();let u=Te(t,a);o&&B.has(o[0])&&(u=Math.max(0,u-1));const c=" ".repeat(u*2),i=l.slice(0,l.length-o.length);if(i===c)return!1;R(e,a,a+i.length,c);const f=c.length-i.length,b=p=>p<=a+i.length?a+c.length:p+f;return e.setSelectionRange(b(s),b(n)),!0}function ve(e){const t=[],s=[];let n=!1,a=!1,d=!1;for(let l=0;l<e.length;l+=1){const o=e[l];if(a){o===`
`&&(a=!1);continue}if(n){!d&&o==='"'&&(n=!1),d=!d&&o==="\\";continue}if(o===";"){a=!0;continue}if(o==='"'){n=!0,d=!1;continue}if(Object.hasOwn(O,o)&&s.push({opener:o,start:l}),B.has(o)&&s.length&&O[s.at(-1).opener]===o){const u=s.pop();t.push({start:u.start,end:l+1})}}return t}function we(e,t,s=e.length){let n=t;for(;n<s;){if(/\s/.test(e[n])){n+=1;continue}if(e[n]===";"){const l=e.indexOf(`
`,n);n=l===-1?s:l+1;continue}break}if(n>=s)return null;const a=e[n];if(Object.hasOwn(O,a)){const l=O[a];let o=0,u=!1,c=!1;for(let i=n;i<s;i+=1){const f=e[i];if(u){!c&&f==='"'&&(u=!1),c=!c&&f==="\\";continue}if(f==='"'){u=!0,c=!1;continue}if(f===a&&(o+=1),f===l&&--o===0)return{start:n,end:i+1}}return null}if(a==='"'){let l=!1;for(let o=n+1;o<s;o+=1){if(!l&&e[o]==='"')return{start:n,end:o+1};l=!l&&e[o]==="\\"}return null}let d=n;for(;d<s&&!/\s/.test(e[d])&&!"()[]{}".includes(e[d]);)d+=1;return d>n?{start:n,end:d}:null}function oe(e,t){return ve(e).filter(s=>s.start<t&&t<s.end).sort((s,n)=>s.end-s.start-(n.end-n.start))[0]??null}function je(e){const{value:t,selectionStart:s,selectionEnd:n}=e,a=oe(t,s);if(!a)return!1;const d=we(t,a.end);return d?(R(e,a.end-1,d.end,`${t.slice(a.end,d.end)}${t[a.end-1]}`),e.setSelectionRange(s,n),!0):!1}function Ie(e){const{value:t,selectionStart:s,selectionEnd:n}=e,a=oe(t,s);if(!a)return!1;const d=[];for(let c=a.start+1;c<a.end-1;){const i=we(t,c,a.end-1);if(!i)break;d.push(i),c=i.end}const l=d.at(-1);if(!l)return!1;const o=t.slice(a.start+1,l.start).match(/\s*$/)?.[0]??"",u=l.start-o.length;return R(e,u,a.end,`${t[a.end-1]}${o}${t.slice(l.start,a.end-1)}`),e.setSelectionRange(s,n),!0}function Me(e){const{value:t,selectionStart:s}=e,a=oe(t,s)?.end-1;return a==null||s>=a?!1:(R(e,s,a,""),!0)}function me(e,t){const s=ve(e);if(/\s/.test(e[t]??"")){const c=s.filter(i=>i.end<=t).sort((i,f)=>f.end-i.end||i.end-i.start-(f.end-f.start))[0];if(c)return{...c,source:e.slice(c.start,c.end)}}const n=s.filter(c=>c.start<=t&&t<=c.end).sort((c,i)=>c.end-c.start-(i.end-i.start));if(n.length){const c=n[0];return{...c,source:e.slice(c.start,c.end)}}const a=s.filter(c=>c.end<=t).sort((c,i)=>i.end-c.end)[0];if(a)return{...a,source:e.slice(a.start,a.end)};const d=(e.slice(0,t).search(/[^\s()[\]{}]/)===-1,t),l=e.lastIndexOf(`
`,d-1)+1,o=e.slice(l,e.indexOf(`
`,d)===-1?e.length:e.indexOf(`
`,d)),u=/[^\s()[\]{}]+/g;for(const c of o.matchAll(u)){const i=l+c.index,f=i+c[0].length;if(i<=t&&t<=f)return{start:i,end:f,source:c[0]}}return null}function Y(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function Ke(e,{evalRange:t=null}={}){let s="",n=0,a=!1,d=!1,l=!1;const o=u=>t&&u>=t.start&&u<t.end?" eval-target":"";for(let u=0;u<e.length;u+=1){const c=e[u];if(d){s+=`<span class="comment${o(u)}">${Y(c)}</span>`,c===`
`&&(d=!1);continue}if(a){s+=`<span class="string${o(u)}">${Y(c)}</span>`,!l&&c==='"'&&(a=!1),l=!l&&c==="\\";continue}if(c===";"){d=!0,s+=`<span class="comment${o(u)}">;</span>`;continue}if(c==='"'){a=!0,l=!1,s+=`<span class="string${o(u)}">"</span>`;continue}if("([{".includes(c)){s+=`<span class="paren-${n%6}${o(u)}">${c}</span>`,n+=1;continue}if(")]}".includes(c)){n-=1,s+=`<span class="${n<0?"unmatched":`paren-${n%6}`}${o(u)}">${c}</span>`;continue}if(c===":"){const i=e.slice(u).match(/^:[A-Za-z*+!?._/-]+/);if(i){s+=`<span class="keyword${o(u)}">${Y(i[0])}</span>`,u+=i[0].length-1;continue}}s+=o(u)?`<span class="eval-target">${Y(c)}</span>`:Y(c)}return s}function qe(e,t){return{"studio.store":`${t}/rust/studio/hal/store.hal`,"studio.fs":`${t}/rust/studio/hal/fs.hal`,"studio.node":`${e}/studio/hal/node.hal`,"studio.draw":`${e}/studio/hal/draw.hal`,"std.substrate.core":`${e}/std/substrate/core.hal`,"std.substrate.frame":`${e}/std/substrate/frame.hal`,"std.substrate.json":`${e}/std/substrate/json.hal`,"std.substrate.protocol":`${e}/std/substrate/protocol.hal`,"std.substrate.pubsub":`${e}/std/substrate/pubsub.hal`,"std.substrate.request":`${e}/std/substrate/request.hal`,"std.substrate.router":`${e}/std/substrate/router.hal`,"std.substrate.space":`${e}/std/substrate/space.hal`,"std.substrate.transport-memory":`${e}/std/substrate/transport_memory.hal`,"std.substrate.util":`${e}/std/substrate/util.hal`,"std.substrate.util-handlers":`${e}/std/substrate/util_handlers.hal`,"std.substrate":`${e}/std/substrate.hal`}}function He(e,t=fetch){if(typeof e!="function")return t;let s=0,n=0;return async(a,d)=>{const l=await t(a,d),o=Number(l.headers.get("content-length"))||0;if(n+=o,!l.body)return l;const u=l.body.getReader(),c=new ReadableStream({async pull(i){const{done:f,value:b}=await u.read();if(f){i.close();return}s+=b.byteLength;const p=n?Math.min(99,Math.round(s/n*100)):0;e("Loading Hara kernel",p),i.enqueue(b)}});return new Response(c,{status:l.status,statusText:l.statusText,headers:l.headers})}}async function De({createKernel:e,kernelModuleUrl:t}){if(e)return e;const s=await import(t);if(typeof s.createDocsKernel!="function")throw new Error(`kernel module ${t} does not export createDocsKernel`);return s.createDocsKernel}const V=new Map;function xe({runtimeBase:e="/runtime",docsAssetsBase:t="/docs-assets",kernelModuleUrl:s=null,createKernel:n=null,manifestUrl:a=null,workerUrl:d=null,resources:l=null,fetchAsset:o=null,onProgress:u=null}={}){const c={runtimeBase:e,docsAssetsBase:t,kernelModuleUrl:s??`${t}/javascripts/kernel.js`,manifestUrl:a??`${e}/kernel-manifest.json`,workerUrl:d??`${e}/hta-worker.js`,resources:l??qe(e,t)},i=n?null:JSON.stringify(c);if(i&&V.has(i))return V.get(i);const f=He(u,o??fetch),b=Promise.resolve().then(()=>f(c.manifestUrl)).then(async p=>{if(!p.ok)throw new Error(`kernel manifest: ${p.status}`);const w=await p.json();return(await De({createKernel:n,kernelModuleUrl:c.kernelModuleUrl}))({wasmUrl:w.variants.core.url,workerUrl:c.workerUrl,manifest:w,resources:c.resources,fetchAsset:f})});return i&&(V.set(i,b),b.catch(()=>{V.get(i)===b&&V.delete(i)})),b}const Ne=`(ns+)

(require [studio.draw :as draw])

;; Pong
;; Full-screen autonomous Pong. Both horizontal paddles track the ball while
;; the ball bounces from the viewport edges and the paddle faces.
;; TRY: change paddle-speed to make the rally more or less forgiving.
;; TRY: change the initial vx/vy values to alter the rhythm.

(def game-width 1000)
(def game-height 600)
(def ball-radius 12)
(def paddle-width 180)
(def paddle-height 16)
(def paddle-speed 8)
(def top-y 48)
(def bottom-y (- game-height 64))

(defn smaller [a b] (if (< a b) a b))
(defn larger [a b] (if (> a b) a b))
(defn absolute [value] (if (neg? value) (- 0 value) value))
(defn clamp [value low high]
  (if (< value low) low (if (> value high) high value)))

(defn initial-state []
  {:top-x (/ (- game-width paddle-width) 2)
   :bottom-x (/ (- game-width paddle-width) 2)
   :ball {:x (/ game-width 2)
          :y (/ game-height 2)
          :vx 6
          :vy 5}})

(defn track-paddle [position target speed]
  (let [delta (- target (+ position (/ paddle-width 2)))]
    (let [step (clamp delta (- 0 speed) speed)]
      (clamp (+ position step) 0 (- game-width paddle-width)))))

(defn update-paddles [state]
  (let [ball-x (get (get state :ball) :x)]
    (let [top-x (track-paddle (get state :top-x) ball-x paddle-speed)
          bottom-x (track-paddle (get state :bottom-x) ball-x paddle-speed)]
      (assoc (assoc state :top-x top-x) :bottom-x bottom-x))))

(defn advance-ball [ball]
  (assoc
    (assoc ball :x (+ (get ball :x) (get ball :vx)))
    :y
    (+ (get ball :y) (get ball :vy))))

(defn bounce-side-walls [ball]
  (let [x (get ball :x)
        vx (get ball :vx)]
    (if (<= x ball-radius)
      (assoc (assoc ball :x ball-radius) :vx (absolute vx))
      (if (>= x (- game-width ball-radius))
        (assoc
          (assoc ball :x (- game-width ball-radius))
          :vx
          (- 0 (absolute vx)))
        ball))))

(defn over-paddle [ball paddle-x]
  (let [x (get ball :x)]
    (if (>= x (- paddle-x ball-radius))
      (<= x (+ paddle-x paddle-width ball-radius))
      false)))

(defn bounce-paddles [ball top-x bottom-x]
  (let [y (get ball :y)
        vy (get ball :vy)]
    (if (if (< vy 0)
          (if (<= y (+ top-y paddle-height ball-radius))
            (over-paddle ball top-x)
            false)
          false)
      (assoc
        (assoc ball :y (+ top-y paddle-height ball-radius))
        :vy
        (absolute vy))
      (if (if (> vy 0)
            (if (>= y (- bottom-y ball-radius))
              (over-paddle ball bottom-x)
              false)
            false)
        (assoc
          (assoc ball :y (- bottom-y ball-radius))
          :vy
          (- 0 (absolute vy)))
        ball))))

(defn bounce-screen-walls [ball]
  (let [y (get ball :y)
        vy (get ball :vy)]
    (if (<= y ball-radius)
      (assoc (assoc ball :y ball-radius) :vy (absolute vy))
      (if (>= y (- game-height ball-radius))
        (assoc
          (assoc ball :y (- game-height ball-radius))
          :vy
          (- 0 (absolute vy)))
        ball))))

(defn update-state [state]
  (let [tracked (update-paddles state)]
    (let [moved (advance-ball (get tracked :ball))]
      (let [side-bounced (bounce-side-walls moved)]
        (let [paddle-bounced
              (bounce-paddles side-bounced (get tracked :top-x) (get tracked :bottom-x))]
          (assoc tracked :ball (bounce-screen-walls paddle-bounced)))))))

(defn viewport [width height]
  {:width width :height height :left 0 :top 0})

(defn scale-x [view x]
  (/ (* x (get view :width)) game-width))

(defn scale-y [view y]
  (/ (* y (get view :height)) game-height))

(defn scale-width [view width]
  (/ (* width (get view :width)) game-width))

(defn scale-height [view height]
  (/ (* height (get view :height)) game-height))

(defn field-commands [view]
  ;; The whole browser canvas is the playfield. Keeping this command list
  ;; empty avoids drawing a separate framed or tinted "screen" over the hero.
  (list))

(defn paddle-commands [view paddle color]
  (let [left (scale-x view (get paddle :x))
        top (scale-y view (get paddle :y))
        width (scale-width view paddle-width)
        height (larger 6 (scale-height view paddle-height))]
    (list
      [:rect left (- top 4) width (+ height 8) color 0.12]
      [:rect left top width height color 0.96])))

(defn ball-commands [view ball]
  (let [x (scale-x view (get ball :x))
        y (scale-y view (get ball :y))
        radius (larger 6 (scale-width view ball-radius))]
    (list
      [:circle x y (+ radius 8) "#41f5e4" 0.12]
      [:circle x y radius "#f5ffff" 1.0])))

(defn append-commands [commands additions]
  (loop [index 0 result commands]
    (if (< index (count additions))
      (recur (inc index) (conj result (nth additions index)))
      result)))

(defn draw-pong-game [state width height]
  (let [view (viewport width height)]
    (let [field (field-commands view)
          top
          (paddle-commands
            view {:x (get state :top-x) :y top-y} "#ff2e88")
          bottom
          (paddle-commands
            view {:x (get state :bottom-x) :y bottom-y} "#41f5e4")]
      (let [with-top (append-commands field top)]
        (let [with-bottom (append-commands with-top bottom)]
          (let [with-ball
                (append-commands with-bottom (ball-commands view (get state :ball)))]
            (conj
              with-ball
              [:text "PONG.HAL // AUTOPLAY" 18 (- height 18) "#9ab3c7" 12 0.84])))))))

(node/start
  (fn []
    (loop [state (initial-state)]
      (let [frame (co/await (draw/next-frame "canvas/background"))]
        (let [width (get frame "canvas/width")
              height (get frame "canvas/height")
              next-state (update-state state)]
          (do
            (co/await
              (draw/render
                "canvas/background"
                {:type :canvas-2d
                 :background "#02050b"
                 :commands (draw-pong-game next-state width height)}))
            (recur next-state)))))))
`,_e="(+ 19 23)",ze=`(def scores [4 8 15 16 23 42])

(map (fn [score] (* score 2)) scores)

(filter (fn [score] (> score 10)) scores)`,Ue=`(def game
  (atom {:turn :x
         :moves []}))

(swap! game update :moves conj [1 1])
(deref game)`,Fe=`(def +winning-conditions+
  [#{:aa :ab :ac} #{:ba :bb :bc} #{:ca :cb :cc}
   #{:aa :ba :ca} #{:ab :bb :cb} #{:ac :bc :cc}
   #{:aa :bb :cc} #{:ac :bb :ca}])

(defn new-game []
  {:board {:bg #{:aa :ab :ac
                 :ba :bb :bc
                 :ca :cb :cc}
           :p1 #{}
           :p2 #{}}
   :turn :p1
   :status :active
   :winner nil
   :winning-line nil})

(defn subset-of? [condition positions]
  (let [cells (vec condition)]
    (loop [index 0]
      (if (< index (count cells))
        (if (contains? positions (nth cells index))
          (recur (inc index))
          false)
        true))))

(defn winning-condition [positions]
  (loop [index 0]
    (if (< index (count +winning-conditions+))
      (let [condition (nth +winning-conditions+ index)]
        (if (subset-of? condition positions)
          condition
          (recur (inc index))))
      nil)))

(defn next-move
  "Transitions from one game state to the next."
  [game move]
  (let [[side pos] move
        board (get game :board)
        turn (get game :turn)
        status (get game :status)]
    (do
      (when (not= status :active)
        (throw (ex-info "Game has finished." {:game game :move move})))
      (when (not= turn side)
        (throw (ex-info (str "Not " side "'s turn.") {:game game :move move})))
      (when (not (contains? (get board :bg) pos))
        (throw (ex-info "Position already taken." {:game game :move move})))
      (let [new-board
            (assoc
              (assoc board :bg (disj (get board :bg) pos))
              side
              (conj (get board side) pos))]
        (let [line (winning-condition (get new-board side))
              is-full (= 0 (count (get new-board :bg)))]
          (let [is-winner (not (nil? line))]
            {:board new-board
             :turn (if (= side :p1) :p2 :p1)
             :status (if is-winner :done (if is-full :done :active))
             :winner (if is-winner side (if is-full :draw nil))
             :winning-line line}))))))

(next-move (new-game) [:p1 :bb])`,Ye=[{id:"first-eval",title:"First eval",kind:"console",source:_e},{id:"collections",title:"Collections",kind:"console",source:ze},{id:"state",title:"State",kind:"console",source:Ue},{id:"tictactoe-move",title:"Tic-tac-toe",kind:"console",source:Fe},{id:"canvas-pong",title:"Pong",kind:"canvas",source:Ne}],Ve=e=>e?.constructor?.name??"",A=(e,t=new Set)=>{if(e==null)return"nil";if(typeof e=="string")return JSON.stringify(e);if(["number","bigint","boolean"].includes(typeof e))return String(e);const s=Ve(e);if(s==="HtaKeyword")return`:${e.name}`;if(s==="HtaSymbol")return e.name;if(s==="HtaVar")return`#'${A(e.symbol,t)}`;if(s==="HtaHandle")return String(e);if(typeof e=="object"){if(t.has(e))return"#<cycle>";t.add(e)}let n;if(s==="HtaAtom")n=`#atom <${A(e.value,t)}>`;else if(s==="HtaArray")n=`(array${e.values?.length?` ${e.values.map(a=>A(a,t)).join(" ")}`:""})`;else if(s==="HtaObject"){const a=e.entries??[];n=`(object${a.length?` ${a.map(([d,l])=>`${JSON.stringify(d)} ${A(l,t)}`).join(" ")}`:""})`}else if(e instanceof Uint8Array)n=`#bytes[${[...e].join(" ")}]`;else if(Array.isArray(e))n=`[${e.map(a=>A(a,t)).join(" ")}]`;else if(e instanceof Set)n=`#{${[...e].map(a=>A(a,t)).join(" ")}}`;else if(e instanceof Map)n=`{${[...e].map(([a,d])=>`${A(a,t)} ${A(d,t)}`).join(" ")}}`;else if(typeof e=="object"){const a=e.toString?.();n=a&&a!=="[object Object]"?a:`#js {${Object.entries(e).map(([d,l])=>`${JSON.stringify(d)} ${A(l,t)}`).join(" ")}}`}else n=String(e);return typeof e=="object"&&t.delete(e),n},U=e=>String(e?.message??e).replace(/^Error: /,"");async function Ge(e,t){return Promise.race([e,t.then(()=>{throw new Error("canvas task stopped before rendering its first frame")})])}function Je(e){if(typeof e?.cancel!="function")return!1;try{return e.cancel()!==!1}catch{return!1}}function We(e,{requestFrame:t=globalThis.requestAnimationFrame?.bind(globalThis),setTimer:s=globalThis.setTimeout?.bind(globalThis)}={}){let n=!1;const a=()=>{n||e()};return typeof t=="function"?t(a):s?.(a,0),()=>{n=!0}}const Xe={idle:"Idle",loading:"Connecting",ready:"Connected",busy:"Evaluating",error:"Unavailable"},Ze=(e,t,s)=>Math.min(s,Math.max(t,e));function Qe(e){const t=document.createElement("div");return t.className="hara-live-card-toast",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.innerHTML="<i></i><span>Preparing Hara kernel</span><b>0%</b>",t.hidden=!0,e.append(t),{element:t,show(){t.hidden=!1},report(s,n){t.querySelector("span").textContent=s,t.querySelector("b").textContent=`${n??0}%`,t.style.setProperty("--kernel-progress",`${n??0}%`)},fail(s){t.dataset.state="error",t.querySelector("span").textContent=s,t.querySelector("b").textContent=""},remove(){t.remove()}}}function Se(e,{label:t,initialHeight:s,minimumHeight:n,maximumHeight:a=()=>Math.max(n,Math.round((globalThis.innerHeight||900)*.8)),onResize:d=()=>{}}){const l=document.createElement("div");l.className="hara-live-card-resizer",l.tabIndex=0,l.setAttribute("role","separator"),l.setAttribute("aria-label",t),l.setAttribute("aria-orientation","horizontal"),e.append(l);let o=null,u=0,c=0;const i=()=>typeof a=="function"?a():a,f=p=>{const w=Math.round(Ze(p,n,Math.max(n,i())));return e.style.height=`${w}px`,l.setAttribute("aria-valuemin",String(n)),l.setAttribute("aria-valuemax",String(Math.round(i()))),l.setAttribute("aria-valuenow",String(w)),d(w),w},b=p=>{if(!(o===null||p&&p.pointerId!==o)){try{l.releasePointerCapture?.(o)}catch{}o=null,delete e.dataset.resizing}};return l.addEventListener("pointerdown",p=>{p.pointerType!=="touch"&&p.button!==0||(p.preventDefault(),o=p.pointerId,u=p.clientY,c=e.getBoundingClientRect().height,e.dataset.resizing="true",l.setPointerCapture?.(p.pointerId))}),l.addEventListener("pointermove",p=>{p.pointerId===o&&(p.preventDefault(),f(c+p.clientY-u))}),l.addEventListener("pointerup",b),l.addEventListener("pointercancel",b),l.addEventListener("lostpointercapture",b),l.addEventListener("keydown",p=>{if(!["ArrowUp","ArrowDown","Home","End"].includes(p.key))return;p.preventDefault();const w=e.getBoundingClientRect().height,k=p.shiftKey?48:16;p.key==="ArrowUp"?f(w-k):p.key==="ArrowDown"?f(w+k):p.key==="Home"?f(n):f(i())}),l.addEventListener("dblclick",()=>f(s)),f(s),{handle:l,setHeight:f,destroy:()=>l.remove()}}const Be=(e,t)=>{const s=t.getBoundingClientRect();return{type:"pointer",phase:e.type==="pointerup"?"up":e.type==="pointermove"?"move":"down",x:Math.round(e.clientX-s.left),y:Math.round(e.clientY-s.top),button:e.button??0,pointer:e.pointerType??"mouse"}};function et(e,{runtimeBase:t,onRunningChange:s=()=>{}}){const n=document.createElement("canvas");n.className="hara-live-card-canvas",n.width=960,n.height=600,n.tabIndex=0,n.setAttribute("aria-label","Live Hara canvas output");const a=document.createElement("section");a.className="hara-live-card-canvas-panel",a.hidden=!0,a.innerHTML=`
    <div class="hara-live-card-canvas-meta">
      <span>ISOLATED · CANVAS/2D</span>
      <output aria-live="polite">Waiting to run</output>
    </div>`,a.append(n),e.append(a);const d=a.querySelector("output"),l="canvas/background";let o=null,u=null,c=null,i=0,f=null,b=null,p=null,w=!1;const k=(v,E="")=>{d.textContent=v,d.dataset.state=E},g=()=>{const v=n.getContext?.("2d");v&&(v.setTransform(1,0,0,1,0,0),v.clearRect(0,0,n.width,n.height),v.fillStyle="#02050b",v.fillRect(0,0,n.width,n.height))},G=Se(a,{label:"Resize canvas",initialHeight:Math.min(500,Math.max(300,Math.round((globalThis.innerHeight||800)*.52))),minimumHeight:220,onResize:()=>o?.resize(n)}),K=async v=>{if(!o){const[E,y]=await Promise.all([be(()=>import(`${t}/studio/broker.js`),[]),be(()=>import(`${t}/studio/canvas-runtime.js`),[])]);u=E.compileAnonymousDocument,o=new y.CanvasRuntime({capabilities:["canvas/2d"],onDiagnostic:m=>k(U(m),"error")}),o.register(l,n),o.resize(n)}c??=v.registerCanvas(o)};for(const v of["pointerdown","pointermove","pointerup"])n.addEventListener(v,E=>{v==="pointerdown"&&n.setPointerCapture?.(E.pointerId),o?.pushEvent(Be(E,n))});const N=({clear:v=!0,statusText:E="Stopped"}={})=>{if(w)return!1;i+=1;const y=[...new Set([f,b].filter(Boolean))];f=null,b=null;for(const $ of y)o?.release($,l);const m=p;p=null;const T=Je(m);return v&&g(),E!==null&&k(E,"idle"),s(!1),T||y.length>0};return{evaluate:async(v,E)=>{if(w)throw new Error("canvas stage is closed");N({clear:!1,statusText:null});const y=++i,m=`live-card-${y}`;f=m,k("Starting canvas","loading"),await K(v),o.stage(m,l);try{const T=u(E,{documentId:`${location.pathname}/live-card`,nodeId:m}),$=await v.evalRaw(T.source);if(typeof $!="string"||!$.startsWith("task-"))throw new Error(`canvas program did not start a node task: ${A($)}`);const C=o.waitForFirstRender(m,l,8e3),_=v.evalRaw(`(studio.node/run-task ${JSON.stringify($)})`);return p=_,_.then(()=>{_!==p||y!==i||(p=null,o.release(m,l),b===m&&(b=null),f===m&&(f=null),k("Stopped","idle"),s(!1))},J=>{_!==p||y!==i||(p=null,o.release(m,l),b===m&&(b=null),f===m&&(f=null),k(U(J),"error"),s(!1))}),await Ge(C,_),y!==i?(o.release(m,l),{value:null,label:"Canvas interrupted"}):(o.commit(m,l),f=null,b=m,k("Live · Stop or Esc to interrupt","ready"),s(!0),{value:null,label:"Canvas live"})}catch(T){if(o.release(m,l),y!==i)return{value:null,label:"Canvas interrupted"};throw f=null,b=null,p&&y===i&&(p=null),k(U(T),"error"),s(!1),T}},interrupt:N,isRunning:()=>!!(p||f||b),setStatus:k,show(){a.hidden=!1},hide(){a.hidden=!0},close(){w||(N({clear:!1,statusText:null}),w=!0,c?.(),o?.close(),G.destroy(),a.remove())}}}function tt(e){const{value:t,selectionStart:s,selectionEnd:n}=e;if(s===n)return null;const a=t.slice(s,n),d=a.match(/^\s*/)?.[0].length??0,l=a.match(/\s*$/)?.[0].length??0,o=s+d,u=n-l;return o<u?{source:t.slice(o,u),start:o,end:u}:null}function ge(e,t=!1){const s=tt(e);if(s)return s;const{value:n,selectionStart:a}=e;if(t){const d=n.lastIndexOf(`
`,Math.max(0,a-1))+1,l=d+(n.slice(d).match(/^\s*/)?.[0].length??0),o=me(n,l);if(o?.start===l&&o.end>=a)return o}return me(n,a)}function nt(e,{snippets:t=Ye,activeSnippet:s=null,kernel:n=null,runtimeBase:a="/runtime",docsAssetsBase:d="/docs-assets",kernelModuleUrl:l=null,createKernel:o=null,fetchAsset:u=null,playgroundUrl:c="https://playground.hara-lang.org/"}={}){const i=document.createElement("section");i.className="hara-live-card",i.dataset.connectionState="idle",i.dataset.instarepl="true",i.innerHTML=`
    <header class="hara-live-card-header">
      <span class="hara-live-card-status" title="Kernel status">
        <i class="hara-live-card-connection" aria-hidden="true"></i>
        <small data-live-connection-label>Idle</small>
      </span>
      <button type="button" class="hara-live-card-eval" data-live-eval>Eval</button>
      <button type="button" class="hara-live-card-run" data-live-run>Run</button>
      <button type="button" class="hara-live-card-eval hara-live-card-reset" data-live-reset hidden>Reset</button>
      <div class="hara-live-card-tabs" role="tablist" aria-label="Examples"></div>
      <a class="hara-live-card-playground" target="_blank" rel="noopener">Open in Playground</a>
    </header>
    <div class="hara-live-card-editor">
      <pre class="code-highlight" aria-hidden="true"><code></code></pre>
      <textarea spellcheck="false" wrap="off" aria-label="Hara source editor"></textarea>
    </div>
    <output class="hara-live-card-output" aria-live="polite" hidden></output>`,e.append(i);const f=i.querySelector(".hara-live-card-tabs"),b=i.querySelector(".hara-live-card-playground"),p=i.querySelector(".hara-live-card-editor"),k=i.querySelector(".code-highlight").querySelector("code"),g=i.querySelector("textarea"),G=i.querySelector("[data-live-eval]"),K=i.querySelector("[data-live-run]"),N=i.querySelector("[data-live-reset]"),x=i.querySelector(".hara-live-card-output"),v=i.querySelector("[data-live-connection-label]");b.href=c;const E=new Map(t.map(r=>[r.id,r]));let y=E.get(s)??t[0]??null,m=!1;const T=r=>{m=!!r,i.dataset.canvasRunning=String(m),K.textContent=m?"Stop":"Run",K.setAttribute("aria-label",m?"Interrupt running canvas":"Run example"),K.classList.toggle("hara-live-card-run",!m),K.classList.toggle("hara-live-card-eval",m),N.hidden=y?.kind!=="canvas"&&!m},$=Qe(i),C=et(i,{runtimeBase:a,onRunningChange:T}),_=`live-${Math.random().toString(36).slice(2)}`;let J=n?Promise.resolve(n):null,P=null,z=null,j=0,q=!1,W=null,F=!1,I=null,ie=0;const H=(r,h=null)=>{i.dataset.connectionState=r;const S=Xe[r]??r;v.textContent=h?`${S}: ${U(h)}`:S,i.querySelector(".hara-live-card-status").setAttribute("aria-label",h?`${S}: ${U(h)}`:`Kernel ${S}`)},ee=()=>[...f.querySelectorAll("button")],te=r=>{G.disabled=r,K.disabled=r&&!m,N.disabled=r;for(const h of ee())h.disabled=r},ke=()=>(J??=xe({runtimeBase:a,docsAssetsBase:d,kernelModuleUrl:l,createKernel:o,fetchAsset:u,onProgress:(r,h)=>$.report(r,h)}),J),Ee=()=>P||(H("loading"),$.show(),$.report("Preparing Hara kernel",0),P=ke().then(r=>($.report("Starting session",99),r.createSession(_))).then(r=>(q||($.remove(),H("ready")),r)).catch(r=>{throw P=null,$.fail("Kernel unavailable"),H("error",r),r}),P),M=()=>{k.innerHTML=Ke(g.value,{evalRange:z}),k.style.transform=`translate(${-g.scrollLeft}px, ${-g.scrollTop}px)`},$e=Se(p,{label:"Resize editor",initialHeight:230,minimumHeight:150,onResize:M}),ce=typeof ResizeObserver=="function"?new ResizeObserver(M):null;ce?.observe(p);const ne=()=>{x.hidden=!0,delete x.dataset.state,delete x.dataset.mode,x.textContent="",y?.kind==="canvas"?C.show():C.hide(),T(C.isRunning())},ae=({clear:r=!0,statusText:h="Stopped"}={})=>{j+=1;const S=C.interrupt({clear:r,statusText:h});return P&&H("ready"),te(!1),S},de=()=>{j+=1,C.interrupt({clear:!0,statusText:y?.kind==="canvas"?"Waiting to run":null}),z=null,y&&(g.value=y.source),M(),ne(),P&&H("ready")},se=(r,{focus:h=!1}={})=>{const S=E.get(r);if(S){S!==y&&(j+=1,C.interrupt({clear:!0,statusText:null}),y=S,z=null,g.value=S.source,M(),ne());for(const L of ee()){const D=L.dataset.snippetId===S.id;L.setAttribute("aria-selected",String(D)),L.tabIndex=D?0:-1,D&&h&&L.focus()}}};for(const r of t){const h=document.createElement("button");h.type="button",h.setAttribute("role","tab"),h.dataset.snippetId=r.id,h.textContent=r.title,h.setAttribute("aria-selected",String(r===y)),h.tabIndex=r===y?0:-1,h.addEventListener("click",()=>se(r.id)),f.append(h)}f.addEventListener("keydown",r=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(r.key))return;const h=ee();if(!h.length)return;r.preventDefault();const S=Math.max(0,h.indexOf(document.activeElement)),L=r.key==="Home"?0:r.key==="End"?h.length-1:(S+(r.key==="ArrowRight"?1:-1)+h.length)%h.length;se(h[L].dataset.snippetId,{focus:!0})});const ue=async({source:r,mode:h,range:S=null})=>{if(!y||!r?.trim())return;const L=++j,D=h==="run"&&y.kind==="canvas";z=S,M(),te(!0),x.hidden=D,D||(x.dataset.state="pending",x.dataset.mode=h,x.textContent="Evaluating…");let Z=null;try{if(Z=await Ee(),L!==j||q)return;H("busy");const Q=D?await C.evaluate(Z,r):await Z.eval(r);if(L!==j||q)return;H("ready"),D||(x.hidden=!1,x.dataset.state="ready",x.textContent=Q.label??A(Q.value))}catch(Q){if(L!==j||q)return;Z&&H("ready"),x.hidden=!1,x.dataset.state="error",x.textContent=U(Q)}finally{L===j&&!q&&te(!1)}},X=async({preferLine:r=!1}={})=>{const h=ge(g,r);if(!h?.source){x.hidden=!1,x.dataset.state="error",x.dataset.mode="eval",x.textContent="Click or tap inside a form, or select source to evaluate.";return}await ue({source:h.source,mode:"eval",range:h})},fe=()=>ue({source:g.value,mode:"run",range:null}),pe=()=>C.isRunning()?ae():fe();return g.addEventListener("keydown",r=>{if((r.metaKey||r.ctrlKey)&&r.key==="Enter"){r.preventDefault(),pe();return}if(r.altKey&&r.key==="Enter"||r.ctrlKey&&!r.metaKey&&!r.altKey&&r.key.toLowerCase()==="e"){r.preventDefault(),X();return}if(r.ctrlKey&&!r.metaKey&&!r.altKey&&r.key.toLowerCase()==="k"&&Me(g)){r.preventDefault();return}if(r.ctrlKey&&!r.metaKey&&!r.altKey&&(r.key==="ArrowRight"?je:r.key==="ArrowLeft"?Ie:null)?.(g)){r.preventDefault();return}if(!r.metaKey&&!r.ctrlKey&&!r.altKey&&Re(g,r.key)){r.preventDefault();return}r.key==="Tab"&&(r.preventDefault(),r.shiftKey?Oe(g,!0):Pe(g))}),i.addEventListener("keydown",r=>{!(r.key==="Escape"||r.ctrlKey&&!r.metaKey&&r.key===".")||!C.isRunning()||(r.preventDefault(),ae())}),g.addEventListener("input",()=>{z=null,M()}),g.addEventListener("scroll",M),g.addEventListener("select",()=>{const r=ge(g,!0);z=r?{start:r.start,end:r.end}:null,M()}),g.addEventListener("pointerdown",r=>{!r.isPrimary||r.pointerType!=="touch"&&r.button!==0||(I?.(),I=null,F=!1,W={id:r.pointerId,x:r.clientX,y:r.clientY})}),g.addEventListener("pointerup",r=>{const h=W;W=null,!(!h||h.id!==r.pointerId)&&(Math.hypot(r.clientX-h.x,r.clientY-h.y)>8||(F=!0))}),g.addEventListener("click",()=>{F&&(F=!1,I?.(),I=We(()=>{if(I=null,q||g.selectionStart!==g.selectionEnd)return;const r=Date.now();r-ie<280||(ie=r,X({preferLine:!0}))}))}),g.addEventListener("pointercancel",()=>{W=null,F=!1,I?.(),I=null}),G.addEventListener("click",()=>X({preferLine:!0})),K.addEventListener("click",pe),N.addEventListener("click",de),y&&(g.value=y.source),se(y?.id??""),M(),ne(),{eval:X,run:fe,interrupt:ae,reset:de,destroy(){if(q)return;q=!0,j+=1,I?.(),I=null,ce?.disconnect(),$e.destroy(),C.close();const r=P;P=null,r&&r.then(h=>h.close?.()).catch(()=>{}),i.remove()}}}const at={"studio.store":"/runtime/studio/hal/store.hal","studio.fs":"/runtime/studio/hal/fs.hal","studio.node":"/runtime/studio/hal/node.hal","studio.draw":"/runtime/studio/hal/draw.hal","std.substrate.core":"/runtime/std/substrate/core.hal","std.substrate.frame":"/runtime/std/substrate/frame.hal","std.substrate.json":"/runtime/std/substrate/json.hal","std.substrate.protocol":"/runtime/std/substrate/protocol.hal","std.substrate.pubsub":"/runtime/std/substrate/pubsub.hal","std.substrate.request":"/runtime/std/substrate/request.hal","std.substrate.router":"/runtime/std/substrate/router.hal","std.substrate.space":"/runtime/std/substrate/space.hal","std.substrate.transport-memory":"/runtime/std/substrate/transport_memory.hal","std.substrate.util":"/runtime/std/substrate/util.hal","std.substrate.util-handlers":"/runtime/std/substrate/util_handlers.hal","std.substrate":"/runtime/std/substrate.hal"};let re=null;const st={async createSession(e,t={}){return re??=xe({runtimeBase:"/runtime",kernelModuleUrl:"/runtime/browser-kernel.js",resources:at}),(await re).createSession(e,t)},close(){re?.then(e=>e.close())}},rt=[{id:"read",title:"Read",kind:"console",source:"(+ 19 23)"},{id:"make",title:"Make",kind:"console",source:`(def greeting "hello")

(str greeting ", Hara")`}],ye=document.querySelector("[data-live-play]");ye&&nt(ye,{snippets:rt,activeSnippet:"read",kernel:st,runtimeBase:"/runtime"});
