(() => {
  const KEY = "realms-name-picker-v1";
  const races = ["elves","hobbits","dwarves","men"];
  const raceNames = {elves:"Elves",hobbits:"Hobbits",dwarves:"Dwarves",men:"Men"};
  const $ = id => document.getElementById(id);
  let data = loadData();
  let history = [];
  let latestGroups = [];
  let toastTimer;

  function loadData(){
    try { const saved = JSON.parse(localStorage.getItem(KEY)); if(saved && saved.names) return saved; } catch(e){}
    return {names:[]};
  }
  function save(){ localStorage.setItem(KEY, JSON.stringify(data)); updateCounts(); }
  function notify(message){
    const el=$("toast"); el.textContent=message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2400);
  }
  function selectedPool(race){
    return data.names.filter(n => (race==="all" || n.race===race));
  }
  function updateCounts(){
    $("poolCount").textContent=selectedPool($("raceSelect").value).length;
  }
  function addOne(name,race){
    const clean=name.trim();
    if(!clean) return false;
    if(data.names.some(n=>n.name.toLocaleLowerCase()===clean.toLocaleLowerCase() && n.race===race)) return false;
    data.names.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),name:clean,race});
    return true;
  }
  function addNames(){
    const name=$("nameInput").value;
    const race=$("raceForNew").value;
    if(!name.trim()){notify("Write a name first.");return;}
    if(!addOne(name,race)){notify("That name is already in this realm.");return;}
    $("nameInput").value=""; save(); notify(`${name.trim()} has joined the ${raceNames[race]}.`);
  }
  $("addName").addEventListener("click",addNames);
  $("nameInput").addEventListener("keydown",e=>{if(e.key==="Enter")addNames()});
  $("raceSelect").addEventListener("change",updateCounts);
  $("importNames").addEventListener("click",()=>{
    const race=$("raceForNew").value;
    const lines=$("bulkNames").value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
    let added=0; lines.forEach(n=>{if(addOne(n,race))added++});
    $("bulkNames").value="";save();notify(`${added} name${added===1?"":"s"} added to ${raceNames[race]}.`);
  });
  $("clearNames").addEventListener("click",()=>{
    if(!data.names.length){notify("There are no names to clear.");return;}
    if(confirm("Clear every saved name from this browser? This cannot be undone.")){data.names=[];history=[];save();renderHistory();notify("All names have been cleared.");}
  });
  $("exportNames").addEventListener("click",()=>{
    if(!data.names.length){notify("There are no names to export.");return;}
    const csv="Name,Race\n"+data.names.map(n=>`"${n.name.replace(/"/g,'""')}",${raceNames[n.race]}`).join("\n");
    const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="realms-names.csv";a.click();URL.revokeObjectURL(url);
  });
  function draw(){
    const race=$("raceSelect").value; const pool=selectedPool(race);
    if(!pool.length){notify("This gathering has no names yet. Add some names first.");return;}
    const panel=$("revealPanel"); const button=$("drawButton");
    panel.classList.remove("chosen");panel.classList.add("is-drawing");button.disabled=true;button.textContent="The ring is choosing…";
    let ticks=0;const timer=setInterval(()=>{
      const candidate=pool[Math.floor(Math.random()*pool.length)];
      $("chosenName").textContent=candidate.name;
      $("chosenMeta").textContent=raceNames[candidate.race]+" · THE RING IS TURNING";
      ticks++;
      if(ticks>=17){
        clearInterval(timer);panel.classList.remove("is-drawing");panel.classList.add("chosen");
        const final=pool[Math.floor(Math.random()*pool.length)];
        $("chosenName").textContent=final.name;
        $("revealOverline").textContent="THE RING HAS CHOSEN";
        $("chosenMeta").textContent=raceNames[final.race]+" · A NAME BOUND BY FATE";
        history.unshift({name:final.name,race:final.race});history=history.slice(0,8);renderHistory();
        if($("removeAfter").checked){data.names=data.names.filter(n=>n.id!==final.id);save();}
        button.disabled=false;button.innerHTML='Reveal another name <span>✧</span>';
        notify(`${final.name} has been chosen.`);
      }
    },105);
  }
  $("drawButton").addEventListener("click",draw);
  function renderHistory(){
    const list=$("historyList");list.innerHTML="";
    if(!history.length){list.innerHTML='<li class="empty-history">No names chosen yet.</li>';return;}
    history.forEach(item=>{const li=document.createElement("li");li.textContent=`${item.name} — ${raceNames[item.race]}`;list.appendChild(li)});
  }
  $("resetDraw").addEventListener("click",()=>{history=[];renderHistory();$("chosenName").textContent="Who shall be chosen?";$("chosenMeta").textContent="The ring awaits its next name."; $("revealOverline").textContent="THE ANCIENT RING STIRS";$("revealPanel").classList.remove("chosen");notify("Draw history reset.");});
  document.querySelectorAll("[data-race]").forEach(btn=>btn.addEventListener("click",()=>{
    $("raceSelect").value=btn.dataset.race;updateCounts();$("picker").scrollIntoView({behavior:"smooth"});
  }));

  function makeGroups(){
    const race=$("groupRace").value;const pool=selectedPool(race).slice();
    let count=Math.floor(Number($("groupCount").value));
    if(!Number.isFinite(count)||count<2||count>30){notify("Choose between 2 and 30 fellowships.");return;}
    if(pool.length<2){notify("Add at least two names before forming fellowships.");return;}
    count=Math.min(count,pool.length);
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
    latestGroups=Array.from({length:count},()=>[]);
    pool.forEach((person,index)=>latestGroups[index%count].push(person));
    renderGroups();$("copyGroups").disabled=false;notify(`${count} fellowships formed.`);
  }
  function renderGroups(){
    const root=$("groupResults");root.innerHTML="";
    latestGroups.forEach((group,index)=>{
      const card=document.createElement("article");card.className="group-card";
      const title=document.createElement("h3");title.textContent=`FELLOWSHIP ${String(index+1).padStart(2,"0")}`;
      const small=document.createElement("small");small.textContent=`${group.length} MEMBER${group.length===1?"":"S"}`;
      const ol=document.createElement("ol");
      group.forEach(person=>{const li=document.createElement("li");li.textContent=person.name;const meta=document.createElement("small");meta.textContent=` (${raceNames[person.race]})`;li.appendChild(meta);ol.appendChild(li)});
      card.append(title,small,ol);root.appendChild(card);
    });
  }
  $("makeGroups").addEventListener("click",makeGroups);
  $("copyGroups").addEventListener("click",async()=>{
    if(!latestGroups.length)return;
    const text=latestGroups.map((g,i)=>`FELLOWSHIP ${i+1}\n${g.map(n=>`• ${n.name} (${raceNames[n.race]})`).join("\n")}`).join("\n\n");
    try{await navigator.clipboard.writeText(text);notify("Fellowship list copied.");}catch(e){notify("Copy is unavailable in this browser.");}
  });

  const audio=$("backgroundAudio"),music=$("musicToggle");
  music.addEventListener("click",async()=>{
    if(audio.paused){
      try{await audio.play();music.setAttribute("aria-pressed","true");$("musicLabel").textContent="Music on";}
      catch(e){notify("Add assets/background.wav to your GitHub repository to enable the music.");}
    }else{audio.pause();music.setAttribute("aria-pressed","false");$("musicLabel").textContent="Music off";}
  });
  if("serviceWorker" in navigator && location.protocol.startsWith("http")) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
  updateCounts();
})();