const Oe="modulepreload",Re=function(e){return"/"+e},be={},me=function(t,a,n){let s=Promise.resolve();if(a&&a.length>0){let l=function(c){return Promise.all(c.map(i=>Promise.resolve(i).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),u=o?.nonce||o?.getAttribute("nonce");s=l(a.map(c=>{if(c=Re(c),c in be)return;be[c]=!0;const i=c.endsWith(".css"),f=i?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${f}`))return;const b=document.createElement("link");if(b.rel=i?"stylesheet":Oe,i||(b.as="script"),b.crossOrigin="",b.href=c,u&&b.setAttribute("nonce",u),document.head.appendChild(b),i)return new Promise((p,w)=>{b.addEventListener("load",p),b.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${c}`)))})}))}function d(l){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=l,window.dispatchEvent(o),!o.defaultPrevented)throw l}return s.then(l=>{for(const o of l||[])o.status==="rejected"&&d(o.reason);return t().catch(d)})},T={"(":")","[":"]","{":"}"},B=new Set(Object.values(T));function R(e,t,a,n,s="end"){e.setRangeText(n,t,a,s),e.dispatchEvent(new Event("input",{bubbles:!0}))}function oe(e,t){return e.lastIndexOf(`
`,t-1)+1}function Te(e,t){return e.slice(oe(e,t),t).match(/^\s*/)?.[0]??""}function Pe(e,t){const{value:a,selectionStart:n,selectionEnd:s}=e;if(Object.hasOwn(T,t)){const d=T[t];return n!==s?(R(e,n,s,`${t}${a.slice(n,s)}${d}`,"select"),e.setSelectionRange(n+1,s+1)):(R(e,n,s,`${t}${d}`),e.setSelectionRange(n+1,n+1)),!0}if(B.has(t))return n===s&&a[n]===t?e.setSelectionRange(n+1,n+1):R(e,n,s,t),!0;if(t==="Backspace"&&n===s&&n>0&&T[a[n-1]]===a[n])return R(e,n-1,n+1,""),!0;if(t==="Enter"){const l=a.slice(0,n).trimEnd().at(-1),o=Te(a,n)+(Object.hasOwn(T,l)?"  ":"");return R(e,n,s,`
${o}`),!0}return!1}function je(e,t=!1){const{value:a,selectionStart:n,selectionEnd:s}=e;if(!t){R(e,n,s,"  ");return}const d=oe(a,n),l=a.indexOf(`
`,s)===-1?a.length:a.indexOf(`
`,s),u=a.slice(d,l).replace(/^ {1,2}/gm,"");R(e,d,l,u,"select"),e.setSelectionRange(d,d+u.length)}function Ie(e,t){const a=[];let n=!1,s=!1,d=!1;for(let l=0;l<t;l+=1){const o=e[l];if(s){o===`
`&&(s=!1);continue}if(n){!d&&o==='"'&&(n=!1),d=!d&&o==="\\";continue}if(o===";"){s=!0;continue}if(o==='"'){n=!0,d=!1;continue}Object.hasOwn(T,o)?a.push(o):B.has(o)&&T[a.at(-1)]===o&&a.pop()}return a.length}function Me(e){const{value:t,selectionStart:a,selectionEnd:n}=e,s=oe(t,a),d=t.indexOf(`
`,s)===-1?t.length:t.indexOf(`
`,s),l=t.slice(s,d),o=l.trimStart();let u=Ie(t,s);o&&B.has(o[0])&&(u=Math.max(0,u-1));const c=" ".repeat(u*2),i=l.slice(0,l.length-o.length);if(i===c)return!1;R(e,s,s+i.length,c);const f=c.length-i.length,b=p=>p<=s+i.length?s+c.length:p+f;return e.setSelectionRange(b(a),b(n)),!0}function Se(e){const t=[],a=[];let n=!1,s=!1,d=!1;for(let l=0;l<e.length;l+=1){const o=e[l];if(s){o===`
`&&(s=!1);continue}if(n){!d&&o==='"'&&(n=!1),d=!d&&o==="\\";continue}if(o===";"){s=!0;continue}if(o==='"'){n=!0,d=!1;continue}if(Object.hasOwn(T,o)&&a.push({opener:o,start:l}),B.has(o)&&a.length&&T[a.at(-1).opener]===o){const u=a.pop();t.push({start:u.start,end:l+1})}}return t}function ke(e,t,a=e.length){let n=t;for(;n<a;){if(/\s/.test(e[n])){n+=1;continue}if(e[n]===";"){const l=e.indexOf(`
`,n);n=l===-1?a:l+1;continue}break}if(n>=a)return null;const s=e[n];if(Object.hasOwn(T,s)){const l=T[s];let o=0,u=!1,c=!1;for(let i=n;i<a;i+=1){const f=e[i];if(u){!c&&f==='"'&&(u=!1),c=!c&&f==="\\";continue}if(f==='"'){u=!0,c=!1;continue}if(f===s&&(o+=1),f===l&&--o===0)return{start:n,end:i+1}}return null}if(s==='"'){let l=!1;for(let o=n+1;o<a;o+=1){if(!l&&e[o]==='"')return{start:n,end:o+1};l=!l&&e[o]==="\\"}return null}let d=n;for(;d<a&&!/\s/.test(e[d])&&!"()[]{}".includes(e[d]);)d+=1;return d>n?{start:n,end:d}:null}function ie(e,t){return Se(e).filter(a=>a.start<t&&t<a.end).sort((a,n)=>a.end-a.start-(n.end-n.start))[0]??null}function Ke(e){const{value:t,selectionStart:a,selectionEnd:n}=e,s=ie(t,a);if(!s)return!1;const d=ke(t,s.end);return d?(R(e,s.end-1,d.end,`${t.slice(s.end,d.end)}${t[s.end-1]}`),e.setSelectionRange(a,n),!0):!1}function qe(e){const{value:t,selectionStart:a,selectionEnd:n}=e,s=ie(t,a);if(!s)return!1;const d=[];for(let c=s.start+1;c<s.end-1;){const i=ke(t,c,s.end-1);if(!i)break;d.push(i),c=i.end}const l=d.at(-1);if(!l)return!1;const o=t.slice(s.start+1,l.start).match(/\s*$/)?.[0]??"",u=l.start-o.length;return R(e,u,s.end,`${t[s.end-1]}${o}${t.slice(l.start,s.end-1)}`),e.setSelectionRange(a,n),!0}function He(e){const{value:t,selectionStart:a}=e,s=ie(t,a)?.end-1;return s==null||a>=s?!1:(R(e,a,s,""),!0)}function ge(e,t){const a=Se(e);if(/\s/.test(e[t]??"")){const c=a.filter(i=>i.end<=t).sort((i,f)=>f.end-i.end||i.end-i.start-(f.end-f.start))[0];if(c)return{...c,source:e.slice(c.start,c.end)}}const n=a.filter(c=>c.start<=t&&t<=c.end).sort((c,i)=>c.end-c.start-(i.end-i.start));if(n.length){const c=n[0];return{...c,source:e.slice(c.start,c.end)}}const s=a.filter(c=>c.end<=t).sort((c,i)=>i.end-c.end)[0];if(s)return{...s,source:e.slice(s.start,s.end)};const d=(e.slice(0,t).search(/[^\s()[\]{}]/)===-1,t),l=e.lastIndexOf(`
`,d-1)+1,o=e.slice(l,e.indexOf(`
`,d)===-1?e.length:e.indexOf(`
`,d)),u=/[^\s()[\]{}]+/g;for(const c of o.matchAll(u)){const i=l+c.index,f=i+c[0].length;if(i<=t&&t<=f)return{start:i,end:f,source:c[0]}}return null}function V(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function _e(e,{evalRange:t=null}={}){let a="",n=0,s=!1,d=!1,l=!1;const o=u=>t&&u>=t.start&&u<t.end?" eval-target":"";for(let u=0;u<e.length;u+=1){const c=e[u];if(d){a+=`<span class="comment${o(u)}">${V(c)}</span>`,c===`
`&&(d=!1);continue}if(s){a+=`<span class="string${o(u)}">${V(c)}</span>`,!l&&c==='"'&&(s=!1),l=!l&&c==="\\";continue}if(c===";"){d=!0,a+=`<span class="comment${o(u)}">;</span>`;continue}if(c==='"'){s=!0,l=!1,a+=`<span class="string${o(u)}">"</span>`;continue}if("([{".includes(c)){a+=`<span class="paren-${n%6}${o(u)}">${c}</span>`,n+=1;continue}if(")]}".includes(c)){n-=1,a+=`<span class="${n<0?"unmatched":`paren-${n%6}`}${o(u)}">${c}</span>`;continue}if(c===":"){const i=e.slice(u).match(/^:[A-Za-z*+!?._/-]+/);if(i){a+=`<span class="keyword${o(u)}">${V(i[0])}</span>`,u+=i[0].length-1;continue}}a+=o(u)?`<span class="eval-target">${V(c)}</span>`:V(c)}return a}function Ne(e,t){return{"studio.store":`${t}/rust/studio/hal/store.hal`,"studio.fs":`${t}/rust/studio/hal/fs.hal`,"studio.node":`${e}/studio/hal/node.hal`,"studio.draw":`${e}/studio/hal/draw.hal`,"std.substrate.core":`${e}/std/substrate/core.hal`,"std.substrate.frame":`${e}/std/substrate/frame.hal`,"std.substrate.json":`${e}/std/substrate/json.hal`,"std.substrate.protocol":`${e}/std/substrate/protocol.hal`,"std.substrate.pubsub":`${e}/std/substrate/pubsub.hal`,"std.substrate.request":`${e}/std/substrate/request.hal`,"std.substrate.router":`${e}/std/substrate/router.hal`,"std.substrate.space":`${e}/std/substrate/space.hal`,"std.substrate.transport-memory":`${e}/std/substrate/transport_memory.hal`,"std.substrate.util":`${e}/std/substrate/util.hal`,"std.substrate.util-handlers":`${e}/std/substrate/util_handlers.hal`,"std.substrate":`${e}/std/substrate.hal`}}function De(e,t=fetch){if(typeof e!="function")return t;let a=0,n=0;return async(s,d)=>{const l=await t(s,d),o=Number(l.headers.get("content-length"))||0;if(n+=o,!l.body)return l;const u=l.body.getReader(),c=new ReadableStream({async pull(i){const{done:f,value:b}=await u.read();if(f){i.close();return}a+=b.byteLength;const p=n?Math.min(99,Math.round(a/n*100)):0;e("Loading Hara kernel",p),i.enqueue(b)}});return new Response(c,{status:l.status,statusText:l.statusText,headers:l.headers})}}async function ze({createKernel:e,kernelModuleUrl:t}){if(e)return e;const a=await import(t);if(typeof a.createDocsKernel!="function")throw new Error(`kernel module ${t} does not export createDocsKernel`);return a.createDocsKernel}const G=new Map;function Ee({runtimeBase:e="/runtime",docsAssetsBase:t="/docs-assets",kernelModuleUrl:a=null,createKernel:n=null,manifestUrl:s=null,workerUrl:d=null,resources:l=null,fetchAsset:o=null,onProgress:u=null}={}){const c={runtimeBase:e,docsAssetsBase:t,kernelModuleUrl:a??`${t}/javascripts/kernel.js`,manifestUrl:s??`${e}/kernel-manifest.json`,workerUrl:d??`${e}/hta-worker.js`,resources:l??Ne(e,t)},i=n?null:JSON.stringify(c);if(i&&G.has(i))return G.get(i);const f=De(u,o??fetch),b=Promise.resolve().then(()=>f(c.manifestUrl)).then(async p=>{if(!p.ok)throw new Error(`kernel manifest: ${p.status}`);const w=await p.json();return(await ze({createKernel:n,kernelModuleUrl:c.kernelModuleUrl}))({wasmUrl:w.variants.core.url,workerUrl:c.workerUrl,manifest:w,resources:c.resources,fetchAsset:f})});return i&&(G.set(i,b),b.catch(()=>{G.get(i)===b&&G.delete(i)})),b}const le=`(ns+)

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
`,Ue="(+ 19 23)",Fe=`(def scores [4 8 15 16 23 42])

(map (fn [score] (* score 2)) scores)

(filter (fn [score] (> score 10)) scores)`,Ye=`(def game
  (atom {:turn :x
         :moves []}))

(swap! game update :moves conj [1 1])
(deref game)`,Ve=`(def +winning-conditions+
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

(next-move (new-game) [:p1 :bb])`,Ge=[{id:"first-eval",title:"First eval",kind:"console",source:Ue},{id:"collections",title:"Collections",kind:"console",source:Fe},{id:"state",title:"State",kind:"console",source:Ye},{id:"tictactoe-move",title:"Tic-tac-toe",kind:"console",source:Ve},{id:"canvas-pong",title:"Pong",kind:"canvas",source:le}],Je=e=>e?.constructor?.name??"",O=(e,t=new Set)=>{if(e==null)return"nil";if(typeof e=="string")return JSON.stringify(e);if(["number","bigint","boolean"].includes(typeof e))return String(e);const a=Je(e);if(a==="HtaKeyword")return`:${e.name}`;if(a==="HtaSymbol")return e.name;if(a==="HtaVar")return`#'${O(e.symbol,t)}`;if(a==="HtaHandle")return String(e);if(typeof e=="object"){if(t.has(e))return"#<cycle>";t.add(e)}let n;if(a==="HtaAtom")n=`#atom <${O(e.value,t)}>`;else if(a==="HtaArray")n=`(array${e.values?.length?` ${e.values.map(s=>O(s,t)).join(" ")}`:""})`;else if(a==="HtaObject"){const s=e.entries??[];n=`(object${s.length?` ${s.map(([d,l])=>`${JSON.stringify(d)} ${O(l,t)}`).join(" ")}`:""})`}else if(e instanceof Uint8Array)n=`#bytes[${[...e].join(" ")}]`;else if(Array.isArray(e))n=`[${e.map(s=>O(s,t)).join(" ")}]`;else if(e instanceof Set)n=`#{${[...e].map(s=>O(s,t)).join(" ")}}`;else if(e instanceof Map)n=`{${[...e].map(([s,d])=>`${O(s,t)} ${O(d,t)}`).join(" ")}}`;else if(typeof e=="object"){const s=e.toString?.();n=s&&s!=="[object Object]"?s:`#js {${Object.entries(e).map(([d,l])=>`${JSON.stringify(d)} ${O(l,t)}`).join(" ")}}`}else n=String(e);return typeof e=="object"&&t.delete(e),n},F=e=>String(e?.message??e).replace(/^Error: /,"");async function We(e,t){return Promise.race([e,t.then(()=>{throw new Error("canvas task stopped before rendering its first frame")})])}function Xe(e){if(typeof e?.cancel!="function")return!1;try{return e.cancel()!==!1}catch{return!1}}function Ze(e=globalThis.window){const t=["canvas/2d"],a=e?.document?.createElement?.("canvas");try{a?.getContext?.("webgl2")&&t.push("canvas/webgl2")}catch{}return t}function Qe(e,{requestFrame:t=globalThis.requestAnimationFrame?.bind(globalThis),setTimer:a=globalThis.setTimeout?.bind(globalThis)}={}){let n=!1;const s=()=>{n||e()};return typeof t=="function"?t(s):a?.(s,0),()=>{n=!0}}const Be={idle:"Idle",loading:"Connecting",ready:"Connected",busy:"Evaluating",error:"Unavailable"},et=(e,t,a)=>Math.min(a,Math.max(t,e));function tt(e){const t=document.createElement("div");return t.className="hara-live-card-toast",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.innerHTML="<i></i><span>Preparing Hara kernel</span><b>0%</b>",t.hidden=!0,e.append(t),{element:t,show(){t.hidden=!1},report(a,n){t.querySelector("span").textContent=a,t.querySelector("b").textContent=`${n??0}%`,t.style.setProperty("--kernel-progress",`${n??0}%`)},fail(a){t.dataset.state="error",t.querySelector("span").textContent=a,t.querySelector("b").textContent=""},remove(){t.remove()}}}function $e(e,{label:t,initialHeight:a,minimumHeight:n,maximumHeight:s=()=>Math.max(n,Math.round((globalThis.innerHeight||900)*.8)),onResize:d=()=>{}}){const l=document.createElement("div");l.className="hara-live-card-resizer",l.tabIndex=0,l.setAttribute("role","separator"),l.setAttribute("aria-label",t),l.setAttribute("aria-orientation","horizontal"),e.append(l);let o=null,u=0,c=0;const i=()=>typeof s=="function"?s():s,f=p=>{const w=Math.round(et(p,n,Math.max(n,i())));return e.style.height=`${w}px`,l.setAttribute("aria-valuemin",String(n)),l.setAttribute("aria-valuemax",String(Math.round(i()))),l.setAttribute("aria-valuenow",String(w)),d(w),w},b=p=>{if(!(o===null||p&&p.pointerId!==o)){try{l.releasePointerCapture?.(o)}catch{}o=null,delete e.dataset.resizing}};return l.addEventListener("pointerdown",p=>{p.pointerType!=="touch"&&p.button!==0||(p.preventDefault(),o=p.pointerId,u=p.clientY,c=e.getBoundingClientRect().height,e.dataset.resizing="true",l.setPointerCapture?.(p.pointerId))}),l.addEventListener("pointermove",p=>{p.pointerId===o&&(p.preventDefault(),f(c+p.clientY-u))}),l.addEventListener("pointerup",b),l.addEventListener("pointercancel",b),l.addEventListener("lostpointercapture",b),l.addEventListener("keydown",p=>{if(!["ArrowUp","ArrowDown","Home","End"].includes(p.key))return;p.preventDefault();const w=e.getBoundingClientRect().height,k=p.shiftKey?48:16;p.key==="ArrowUp"?f(w-k):p.key==="ArrowDown"?f(w+k):p.key==="Home"?f(n):f(i())}),l.addEventListener("dblclick",()=>f(a)),f(a),{handle:l,setHeight:f,destroy:()=>l.remove()}}const nt=(e,t)=>{const a=t.getBoundingClientRect();return{type:"pointer",phase:e.type==="pointerup"?"up":e.type==="pointermove"?"move":"down",x:Math.round(e.clientX-a.left),y:Math.round(e.clientY-a.top),button:e.button??0,pointer:e.pointerType??"mouse"}};function at(e,{runtimeBase:t,onRunningChange:a=()=>{}}){const n=document.createElement("canvas");n.className="hara-live-card-canvas",n.width=960,n.height=600,n.tabIndex=0,n.setAttribute("aria-label","Live Hara canvas output");const s=document.createElement("section");s.className="hara-live-card-canvas-panel",s.hidden=!0,s.innerHTML=`
    <div class="hara-live-card-canvas-meta">
      <span>ISOLATED · CANVAS</span>
      <output aria-live="polite">Waiting to run</output>
    </div>`,s.append(n),e.append(s);const d=s.querySelector("output"),l="canvas/background";let o=null,u=null,c=null,i=0,f=null,b=null,p=null,w=!1;const k=(y,E="")=>{d.textContent=y,d.dataset.state=E},g=()=>{const y=n.getContext?.("2d");y&&(y.setTransform(1,0,0,1,0,0),y.clearRect(0,0,n.width,n.height),y.fillStyle="#02050b",y.fillRect(0,0,n.width,n.height))},J=$e(s,{label:"Resize canvas",initialHeight:Math.min(500,Math.max(300,Math.round((globalThis.innerHeight||800)*.52))),minimumHeight:220,onResize:()=>o?.resize(n)}),q=async y=>{if(!o){const[E,v]=await Promise.all([me(()=>import(`${t}/studio/broker.js`),[]),me(()=>import(`${t}/studio/canvas-runtime.js`),[])]);u=E.compileAnonymousDocument,o=new v.CanvasRuntime({capabilities:Ze(),onDiagnostic:m=>k(F(m),"error")}),o.register(l,n),o.resize(n)}c??=y.registerCanvas(o)};for(const y of["pointerdown","pointermove","pointerup"])n.addEventListener(y,E=>{y==="pointerdown"&&n.setPointerCapture?.(E.pointerId),o?.pushEvent(nt(E,n))});const D=({clear:y=!0,statusText:E="Stopped"}={})=>{if(w)return!1;i+=1;const v=[...new Set([f,b].filter(Boolean))];f=null,b=null;for(const $ of v)o?.release($,l);const m=p;p=null;const P=Xe(m);return y&&g(),E!==null&&k(E,"idle"),a(!1),P||v.length>0};return{evaluate:async(y,E)=>{if(w)throw new Error("canvas stage is closed");D({clear:!1,statusText:null});const v=++i,m=`live-card-${v}`;f=m,k("Starting canvas","loading"),await q(y),o.stage(m,l);try{const P=u(E,{documentId:`${location.pathname}/live-card`,nodeId:m}),$=await y.evalRaw(P.source);if(typeof $!="string"||!$.startsWith("task-"))throw new Error(`canvas program did not start a node task: ${O($)}`);const L=o.waitForFirstRender(m,l,8e3),z=y.evalRaw(`(studio.node/run-task ${JSON.stringify($)})`);p=z;let U="pending",C=null;if(z.then(()=>{U="fulfilled",!(z!==p||v!==i)&&f!==m&&(p=null,o.release(m,l),b===m&&(b=null),f===m&&(f=null),k("Stopped","idle"),a(!1))},j=>{U="rejected",C=j,!(z!==p||v!==i)&&f!==m&&(p=null,o.release(m,l),b===m&&(b=null),f===m&&(f=null),k(F(j),"error"),a(!1))}),await We(L,z),U!=="pending")throw C||new Error("canvas task stopped before rendering its first frame");return v!==i?(o.release(m,l),{value:null,label:"Canvas interrupted"}):(o.commit(m,l),f=null,b=m,k("Live · Stop or Esc to interrupt","ready"),a(!0),{value:null,label:"Canvas live"})}catch(P){if(o.release(m,l),v!==i)return{value:null,label:"Canvas interrupted"};throw f=null,b=null,p&&v===i&&(p=null),k(F(P),"error"),a(!1),P}},interrupt:D,isRunning:()=>!!(p||f||b),setStatus:k,show(){s.hidden=!1},hide(){s.hidden=!0},close(){w||(D({clear:!1,statusText:null}),w=!0,c?.(),o?.close(),J.destroy(),s.remove())}}}function st(e){const{value:t,selectionStart:a,selectionEnd:n}=e;if(a===n)return null;const s=t.slice(a,n),d=s.match(/^\s*/)?.[0].length??0,l=s.match(/\s*$/)?.[0].length??0,o=a+d,u=n-l;return o<u?{source:t.slice(o,u),start:o,end:u}:null}function ve(e,t=!1){const a=st(e);if(a)return a;const{value:n,selectionStart:s}=e;if(t){const d=n.lastIndexOf(`
`,Math.max(0,s-1))+1,l=d+(n.slice(d).match(/^\s*/)?.[0].length??0),o=ge(n,l);if(o?.start===l&&o.end>=s)return o}return ge(n,s)}function ye(e,{snippets:t=Ge,activeSnippet:a=null,kernel:n=null,runtimeBase:s="/runtime",docsAssetsBase:d="/docs-assets",kernelModuleUrl:l=null,createKernel:o=null,fetchAsset:u=null,playgroundUrl:c="https://play.hara-lang.org/"}={}){const i=document.createElement("section");i.className="hara-live-card",i.dataset.connectionState="idle",i.dataset.instarepl="true",i.innerHTML=`
    <header class="hara-live-card-header">
      <span class="hara-live-card-status" title="Kernel status">
        <i class="hara-live-card-connection" aria-hidden="true"></i>
        <small data-live-connection-label>Idle</small>
      </span>
      <button type="button" class="hara-live-card-eval" data-live-eval>Eval</button>
      <button type="button" class="hara-live-card-run" data-live-run>Run</button>
      <button type="button" class="hara-live-card-eval hara-live-card-reset" data-live-reset hidden>Reset</button>
      <div class="hara-live-card-tabs" role="tablist" aria-label="Examples"></div>
      <a class="hara-live-card-playground" target="_blank" rel="noopener">Open in Play</a>
    </header>
    <div class="hara-live-card-editor">
      <pre class="code-highlight" aria-hidden="true"><code></code></pre>
      <textarea spellcheck="false" wrap="off" aria-label="Hara source editor"></textarea>
    </div>
    <output class="hara-live-card-output" aria-live="polite" hidden></output>`,e.append(i);const f=i.querySelector(".hara-live-card-tabs"),b=i.querySelector(".hara-live-card-playground"),p=i.querySelector(".hara-live-card-editor"),k=i.querySelector(".code-highlight").querySelector("code"),g=i.querySelector("textarea"),J=i.querySelector("[data-live-eval]"),q=i.querySelector("[data-live-run]"),D=i.querySelector("[data-live-reset]"),x=i.querySelector(".hara-live-card-output"),y=i.querySelector("[data-live-connection-label]");b.href=c;const E=new Map(t.map(r=>[r.id,r]));let v=E.get(a)??t[0]??null,m=!1;const P=r=>{m=!!r,i.dataset.canvasRunning=String(m),q.textContent=m?"Stop":"Run",q.setAttribute("aria-label",m?"Interrupt running canvas":"Run example"),q.classList.toggle("hara-live-card-run",!m),q.classList.toggle("hara-live-card-eval",m),D.hidden=v?.kind!=="canvas"&&!m},$=tt(i),L=at(i,{runtimeBase:s,onRunningChange:P}),z=`live-${Math.random().toString(36).slice(2)}`;let U=n?Promise.resolve(n):null,C=null,j=null,I=0,H=!1,W=null,Y=!1,M=null,ce=0;const _=(r,h=null)=>{i.dataset.connectionState=r;const S=Be[r]??r;y.textContent=h?`${S}: ${F(h)}`:S,i.querySelector(".hara-live-card-status").setAttribute("aria-label",h?`${S}: ${F(h)}`:`Kernel ${S}`)},ee=()=>[...f.querySelectorAll("button")],te=r=>{J.disabled=r,q.disabled=r&&!m,D.disabled=r;for(const h of ee())h.disabled=r},Ce=()=>(U??=Ee({runtimeBase:s,docsAssetsBase:d,kernelModuleUrl:l,createKernel:o,fetchAsset:u,onProgress:(r,h)=>$.report(r,h)}),U),Le=()=>C||(_("loading"),$.show(),$.report("Preparing Hara kernel",0),C=Ce().then(r=>($.report("Starting session",99),r.createSession(z))).then(r=>(H||($.remove(),_("ready")),r)).catch(r=>{throw C=null,$.fail("Kernel unavailable"),_("error",r),r}),C),K=()=>{k.innerHTML=_e(g.value,{evalRange:j}),k.style.transform=`translate(${-g.scrollLeft}px, ${-g.scrollTop}px)`},Ae=$e(p,{label:"Resize editor",initialHeight:230,minimumHeight:150,onResize:K}),de=typeof ResizeObserver=="function"?new ResizeObserver(K):null;de?.observe(p);const ne=()=>{x.hidden=!0,delete x.dataset.state,delete x.dataset.mode,x.textContent="",v?.kind==="canvas"?L.show():L.hide(),P(L.isRunning())},ae=({clear:r=!0,statusText:h="Stopped"}={})=>{I+=1;const S=L.interrupt({clear:r,statusText:h});return C&&_("ready"),te(!1),S},ue=()=>{I+=1,L.interrupt({clear:!0,statusText:v?.kind==="canvas"?"Waiting to run":null}),j=null,v&&(g.value=v.source),K(),ne(),C&&_("ready")},se=(r,{focus:h=!1}={})=>{const S=E.get(r);if(S){S!==v&&(I+=1,L.interrupt({clear:!0,statusText:null}),v=S,j=null,g.value=S.source,K(),ne());for(const A of ee()){const N=A.dataset.snippetId===S.id;A.setAttribute("aria-selected",String(N)),A.tabIndex=N?0:-1,N&&h&&A.focus()}}};for(const r of t){const h=document.createElement("button");h.type="button",h.setAttribute("role","tab"),h.dataset.snippetId=r.id,h.textContent=r.title,h.setAttribute("aria-selected",String(r===v)),h.tabIndex=r===v?0:-1,h.addEventListener("click",()=>se(r.id)),f.append(h)}f.addEventListener("keydown",r=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(r.key))return;const h=ee();if(!h.length)return;r.preventDefault();const S=Math.max(0,h.indexOf(document.activeElement)),A=r.key==="Home"?0:r.key==="End"?h.length-1:(S+(r.key==="ArrowRight"?1:-1)+h.length)%h.length;se(h[A].dataset.snippetId,{focus:!0})});const fe=async({source:r,mode:h,range:S=null})=>{if(!v||!r?.trim())return;const A=++I,N=h==="run"&&v.kind==="canvas";j=S,K(),te(!0),x.hidden=N,N||(x.dataset.state="pending",x.dataset.mode=h,x.textContent="Evaluating…");let Z=null;try{if(Z=await Le(),A!==I||H)return;_("busy");const Q=N?await L.evaluate(Z,r):await Z.eval(r);if(A!==I||H)return;_("ready"),N||(x.hidden=!1,x.dataset.state="ready",x.textContent=Q.label??O(Q.value))}catch(Q){if(A!==I||H)return;Z&&_("ready"),x.hidden=!1,x.dataset.state="error",x.textContent=F(Q)}finally{A===I&&!H&&te(!1)}},X=async({preferLine:r=!1}={})=>{const h=ve(g,r);if(!h?.source){x.hidden=!1,x.dataset.state="error",x.dataset.mode="eval",x.textContent="Click or tap inside a form, or select source to evaluate.";return}await fe({source:h.source,mode:"eval",range:h})},pe=()=>fe({source:g.value,mode:"run",range:null}),he=()=>L.isRunning()?ae():pe();return g.addEventListener("keydown",r=>{if((r.metaKey||r.ctrlKey)&&r.key==="Enter"){r.preventDefault(),he();return}if(r.altKey&&r.key==="Enter"||r.ctrlKey&&!r.metaKey&&!r.altKey&&r.key.toLowerCase()==="e"){r.preventDefault(),X();return}if(r.ctrlKey&&!r.metaKey&&!r.altKey&&r.key.toLowerCase()==="k"&&He(g)){r.preventDefault();return}if(r.ctrlKey&&!r.metaKey&&!r.altKey&&(r.key==="ArrowRight"?Ke:r.key==="ArrowLeft"?qe:null)?.(g)){r.preventDefault();return}if(!r.metaKey&&!r.ctrlKey&&!r.altKey&&Pe(g,r.key)){r.preventDefault();return}r.key==="Tab"&&(r.preventDefault(),r.shiftKey?je(g,!0):Me(g))}),i.addEventListener("keydown",r=>{!(r.key==="Escape"||r.ctrlKey&&!r.metaKey&&r.key===".")||!L.isRunning()||(r.preventDefault(),ae())}),g.addEventListener("input",()=>{j=null,K()}),g.addEventListener("scroll",K),g.addEventListener("select",()=>{const r=ve(g,!0);j=r?{start:r.start,end:r.end}:null,K()}),g.addEventListener("pointerdown",r=>{!r.isPrimary||r.pointerType!=="touch"&&r.button!==0||(M?.(),M=null,Y=!1,W={id:r.pointerId,x:r.clientX,y:r.clientY})}),g.addEventListener("pointerup",r=>{const h=W;W=null,!(!h||h.id!==r.pointerId)&&(Math.hypot(r.clientX-h.x,r.clientY-h.y)>8||(Y=!0))}),g.addEventListener("click",()=>{Y&&(Y=!1,M?.(),M=Qe(()=>{if(M=null,H||g.selectionStart!==g.selectionEnd)return;const r=Date.now();r-ce<280||(ce=r,X({preferLine:!0}))}))}),g.addEventListener("pointercancel",()=>{W=null,Y=!1,M?.(),M=null}),J.addEventListener("click",()=>X({preferLine:!0})),q.addEventListener("click",he),D.addEventListener("click",ue),v&&(g.value=v.source),se(v?.id??""),K(),ne(),{eval:X,run:pe,interrupt:ae,reset:ue,destroy(){if(H)return;H=!0,I+=1,M?.(),M=null,de?.disconnect(),Ae.destroy(),L.close();const r=C;C=null,r&&r.then(h=>h.close?.()).catch(()=>{}),i.remove()}}}const rt={"studio.store":"/runtime/studio/hal/store.hal","studio.fs":"/runtime/studio/hal/fs.hal","studio.node":"/runtime/studio/hal/node.hal","studio.draw":"/runtime/studio/hal/draw.hal","std.substrate.core":"/runtime/std/substrate/core.hal","std.substrate.frame":"/runtime/std/substrate/frame.hal","std.substrate.json":"/runtime/std/substrate/json.hal","std.substrate.protocol":"/runtime/std/substrate/protocol.hal","std.substrate.pubsub":"/runtime/std/substrate/pubsub.hal","std.substrate.request":"/runtime/std/substrate/request.hal","std.substrate.router":"/runtime/std/substrate/router.hal","std.substrate.space":"/runtime/std/substrate/space.hal","std.substrate.transport-memory":"/runtime/std/substrate/transport_memory.hal","std.substrate.util":"/runtime/std/substrate/util.hal","std.substrate.util-handlers":"/runtime/std/substrate/util_handlers.hal","std.substrate":"/runtime/std/substrate.hal"},lt=location.hostname==="localhost"||location.hostname.endsWith(".localhost"),we=lt?"/runtime-live":"/runtime";let re=null;const xe={async createSession(e,t={}){return re??=Ee({runtimeBase:"/runtime",kernelModuleUrl:"/runtime/browser-kernel.js",resources:rt}),(await re).createSession(e,t)},close(){re?.then(e=>e.close())}},ot=async()=>{try{const e=await fetch("/examples/studio-backgrounds/src/ocean.hal");return e.ok?await e.text():null}catch{return null}},it=(e,t)=>{[...e.querySelectorAll("[data-snippet-id]")].find(a=>a.dataset.snippetId===t)?.click()},ct=async()=>{const e=await ot(),t=document.querySelector("[data-live-play]"),a=document.querySelector("[data-live-shader-mount]"),n=document.querySelector("[data-live-example-select]"),s=[{id:"read",title:"Read",kind:"console",source:"(+ 19 23)"},{id:"make",title:"Make",kind:"console",source:`(def greeting "hello")

(str greeting ", Hara")`},{id:"compose",title:"Compose",kind:"console",source:`(def scores [4 8 15 16 23 42])

(map (fn [score] (* score 2)) scores)`},{id:"animate",title:"Animate",kind:"canvas",source:le},...e?[{id:"ocean",title:"Ocean shader",kind:"canvas",source:e}]:[]];if(e||n?.querySelector('option[value="ocean"]')?.remove(),t&&(ye(t,{snippets:s,activeSnippet:"read",kernel:xe,runtimeBase:we}),n?.addEventListener("change",()=>it(t,n.value))),a){const d=ye(a,{snippets:[{id:"ocean",title:"Ocean shader",kind:"canvas",source:e??le}],activeSnippet:"ocean",kernel:xe,runtimeBase:we});a.querySelector(".www-v2-shader-placeholder")?.remove(),d.run().catch(()=>{})}};ct();
