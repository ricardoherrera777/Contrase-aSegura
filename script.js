const $=id=>document.getElementById(id);
function rnd(n){const a=new Uint32Array(1),lim=Math.floor(4294967296/n)*n;do{crypto.getRandomValues(a)}while(a[0]>=lim);return a[0]%n}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
const SETS={cMin:"abcdefghijklmnopqrstuvwxyz",cMay:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",cNum:"0123456789",cSim:"!@#$%^&*()-_=+[]{};:,.?"};
const PALABRAS="arbol nube rio luna piedra tigre lirio faro cobre jade musgo vela tormenta ancla brujula cactus delfin espiga fuente glaciar hierro isla jaguar kiosco laguna marmol nido oasis pluma quetzal roble selva tulipan umbral volcan yunque zorro bosque cometa duna eclipse fogata gaviota horizonte iman jardin koala linterna meseta nebulosa olivo puente quinoa relampago sendero trueno ubre velero xilofono yate zafiro abeja barro cereza dragon escudo flecha granito hongo ikebana jirafa kayak lienzo molino nogal orquidea panal quilla rastro sauce tambor urraca viento".split(" ");
function gen(){
  if(document.querySelector('input[name=modo]:checked').value==="frase"){
    const n=+$("nw").value,w=[];
    for(let i=0;i<n;i++){let p=PALABRAS[rnd(PALABRAS.length)];w.push(rnd(2)?p[0].toUpperCase()+p.slice(1):p)}
    const sep="-_.+=".charAt(rnd(5));
    const out=w.join(sep)+sep+(10+rnd(90))+"!#$%&*?".charAt(rnd(7));
    $("salida").value=out;
    const bits=n*Math.log2(PALABRAS.length)+Math.log2(5)+Math.log2(90)+Math.log2(7)+n;
    mostrarG(bits);return;
  }
  const act=Object.keys(SETS).filter(k=>$(k).checked);
  if(!act.length){$("cMin").checked=true;return gen()}
  const len=+$("len").value,pool=act.join("")&&act.map(k=>SETS[k]).join("");
  const c=act.map(k=>SETS[k][rnd(SETS[k].length)]);
  while(c.length<len)c.push(pool[rnd(pool.length)]);
  $("salida").value=shuffle(c).join("");
  mostrarG(len*Math.log2(pool.length));
}
function nivel(b){return b<40?["Débil","var(--bad)",25]:b<60?["Regular","var(--warn)",50]:b<80?["Buena","var(--ac)",75]:["Muy fuerte","var(--ok)",100]}
function mostrarG(b){const[n,c,p]=nivel(b);$("gBar").style.width=p+"%";$("gBar").style.background=c;$("gInfo").textContent=n+" · ~"+Math.round(b)+" bits de entropía"}
const COMUNES=["password","contrasena","contraseña","123456","12345678","qwerty","admin","abc123","letmein","welcome","iloveyou","teamo","futbol","football","monkey","dragon","123123","111111","654321","root","login"];
function norm(s){return s.toLowerCase().replace(/[@4]/g,"a").replace(/3/g,"e").replace(/[!1|]/g,"i").replace(/0/g,"o").replace(/[$5]/g,"s").replace(/7/g,"t")}
function evaluar(){
  const p=$("entrada").value,ul=$("checks");ul.innerHTML="";
  if(!p){$("vBar").style.width="0";$("vLbl").textContent="—";$("vBits").textContent="";return}
  const n=norm(p);
  const has={min:/[a-z]/.test(p),may:/[A-Z]/.test(p),num:/[0-9]/.test(p),sim:/[^A-Za-z0-9]/.test(p)};
  const variedad=Object.values(has).filter(Boolean).length;
  const comun=COMUNES.some(w=>n.includes(norm(w)));
  const patron=/(.)\1\1/.test(p)||/(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|qwer|asdf)/i.test(p);
  const L=[[p.length>=12,"12 caracteres o más ("+p.length+")"],[variedad===4,"Mezcla letras (may/min), números y símbolos"],[!comun,"No contiene palabras comunes"],[!patron,"Sin repeticiones ni secuencias obvias"]];
  L.forEach(([ok,t])=>{const li=document.createElement("li");li.className=ok?"ok":"no";li.textContent=t;ul.appendChild(li)});
  const pool=(has.min?26:0)+(has.may?26:0)+(has.num?10:0)+(has.sim?30:0);
  let bits=p.length*Math.log2(pool||1);
  if(comun)bits=Math.min(bits,25);if(patron)bits*=0.7;if(p.length<12)bits=Math.min(bits,39);
  const[nm,c,pc]=nivel(bits);
  $("vBar").style.width=pc+"%";$("vBar").style.background=c;$("vLbl").textContent=nm;$("vBits").textContent="· ~"+Math.round(bits)+" bits (estimado)";
}
$("gen").onclick=gen;
$("len").oninput=e=>{$("lenV").textContent=e.target.value;gen()};
$("nw").oninput=e=>{$("nwV").textContent=e.target.value;gen()};
["cMin","cMay","cNum","cSim"].forEach(i=>$(i).onchange=gen);
document.querySelectorAll("input[name=modo]").forEach(r=>r.onchange=()=>{const f=r.value==="frase"&&r.checked;if(r.checked){$("opsPw").hidden=f;$("opsFrase").hidden=!f;gen()}});
$("entrada").oninput=evaluar;
$("copiar").onclick=async()=>{try{await navigator.clipboard.writeText($("salida").value);$("copiar").textContent="¡Copiada!"}catch(e){$("salida").select();$("copiar").textContent="Selecciona y copia"}setTimeout(()=>$("copiar").textContent="Copiar",1500)};
const ALL=SETS.cMin+SETS.cMay+SETS.cNum+SETS.cSim,SYMN="0123456789!@#$%^&*()-_=+[]{};:,.?",B=Math.log2(ALL.length),BS=Math.log2(SYMN.length);
const LEET={a:"@4",e:"3",i:"1!",o:"0",s:"$5",t:"7",l:"1",b:"8"};
const rc=s=>s[rnd(s.length)],randStr=(n,p)=>{let o="";for(let i=0;i<n;i++)o+=rc(p);return o};
const cap=w=>w[0].toUpperCase()+w.slice(1);
const ok=p=>p.length>=12&&/[a-z]/.test(p)&&/[A-Z]/.test(p)&&/[0-9]/.test(p)&&/[^A-Za-z0-9]/.test(p);
const leet=w=>[...w].map(ch=>{const o=LEET[ch.toLowerCase()];return o&&rnd(2)?rc(o):(rnd(2)?ch.toUpperCase():ch.toLowerCase())}).join("");
function variantes(w){const n=w.length;return[
 {t:"Sustituciones + relleno aleatorio",f:()=>{const pre=Math.max(4,Math.ceil((16-n)/2)),suf=Math.max(4,16-n-pre);return{pw:randStr(pre,ALL)+leet(w)+randStr(suf,SYMN),bits:pre*B+suf*BS+n+12}}},
 {t:"Frase con tu palabra",f:()=>{const ws=[];for(let i=0;i<3;i++){const p=PALABRAS[rnd(PALABRAS.length)];ws.push(rnd(2)?cap(p):p)}ws.splice(rnd(4),0,cap(w));const s=rc("-_.+=");return{pw:ws.join(s)+s+(10+rnd(90))+rc("!#$%&*?"),bits:3*Math.log2(PALABRAS.length)+2+2.3+6.5+2.8+4+12}}},
 {t:"Palabra entrelazada",f:()=>{let o="";for(const ch of w)o+=ch+randStr(1+rnd(2),ALL);o+=randStr(Math.max(3,14-o.length),ALL);return{pw:o,bits:(o.length-n)*B+12}}},
 {t:"Envuelta en caracteres aleatorios",f:()=>({pw:randStr(7,ALL)+cap(w)+randStr(7,ALL),bits:14*B+12})}
]}
async function copiar(btn,txt){try{await navigator.clipboard.writeText(txt);btn.textContent="¡Copiada!"}catch(e){btn.textContent="Copia manual"}setTimeout(()=>btn.textContent="Copiar",1500)}
function convertir(){
  const w=$("palabra").value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^A-Za-z0-9]/g,"");
  const box=$("vars"),rec=$("recs");box.innerHTML="";rec.innerHTML="";
  const li=(t,c)=>{const e=document.createElement("li");e.textContent=t;if(c)e.className=c;rec.appendChild(e)};
  if(!w){li("Escribe una palabra (letras o números) para empezar.","mu");return}
  const nw=norm(w);
  li("«"+w+"» sola no es segura: una palabra, incluso con @ por a o 0 por o, se adivina con diccionarios. Lo que protege es la parte aleatoria que se le añade.");
  if(w.length<12)li("Tiene "+w.length+" caracteres y el mínimo recomendado es 12, así que se alargó hasta 14–20 con caracteres aleatorios.");
  if(COMUNES.some(c=>nw.includes(norm(c))))li("Es una palabra muy común en contraseñas filtradas; no la uses sin la parte aleatoria.","no");
  li("Se mezclan mayúsculas, minúsculas, números y símbolos (los 4 tipos).");
  li("Elige una variante, guárdala en un gestor de contraseñas y úsala solo en una cuenta.");
  variantes(w).forEach(v=>{let r;for(let i=0;i<40;i++){r=v.f();if(ok(r.pw))break}
    const[nm,c,pc]=nivel(r.bits),d=document.createElement("div");d.className="var";
    d.innerHTML='<div class="lbl"></div><div class="pw"><code></code><button class="sec">Copiar</button></div><div class="meter"><i></i></div><div class="mu"></div>';
    d.children[0].textContent=v.t;d.querySelector("code").textContent=r.pw;
    d.querySelector("button").onclick=e=>copiar(e.target,r.pw);
    const i=d.querySelector("i");i.style.width=pc+"%";i.style.background=c;
    d.children[3].textContent=nm+" · ~"+Math.round(r.bits)+" bits (la palabra base cuenta solo ~12)";
    box.appendChild(d)})
}
$("conv").onclick=convertir;$("palabra").onkeydown=e=>{if(e.key==="Enter")convertir()};

gen();
