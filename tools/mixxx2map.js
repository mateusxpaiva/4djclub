// Converte um mapeamento .midi.xml do Mixxx no formato de mapa do 4DJClub. Mesma lógica usada no navegador.
function mixxxToMap(xml){
  const tag=(b,t)=>{const x=b.match(new RegExp('<'+t+'>([\\s\\S]*?)</'+t+'>','i'));return x?x[1].trim():''};
  const name=tag(xml,'name')||'Controladora',out={},re=/<control>([\s\S]*?)<\/control>/gi;let m;
  while((m=re.exec(xml))){const b=m[1],g=tag(b,'group'),k=tag(b,'key'),kl=k.toLowerCase(),st=parseInt(tag(b,'status')),no=parseInt(tag(b,'midino')),opt=tag(b,'options').toLowerCase();
    if(isNaN(st)||isNaN(no)||opt.includes('fourteen-bit-lsb')||/lsb/.test(kl))continue;
    const type=st&0xf0,ch=(st&15)+1;if(type!==0x90&&type!==0xB0&&type!==0x80)continue;
    const key=(type===0xB0?'c':'n')+ch+'.'+no,dm=g.match(/Channel(\d)\]/),dn=dm?+dm[1]-1:-1;let id=null,arg=null,h;
    if(dn===0||dn===1){const d='d'+dn,x='m'+dn;
      if(/^play$|playbutton/.test(kl))id=d+'.play';
      else if(/^cue_default$|cuebutton\.input$/.test(kl))id=d+'.cue';
      else if(/^beatsync$|^sync_enabled$|syncpressed$|syncbutton\.input$/.test(kl))id=d+'.sync';
      else if(type===0xB0&&/jog|wheel|platter/.test(kl)&&/turn|tick|wheel|scratch|rotate/.test(kl)&&!/search|shift|touch|press/.test(kl))id=d+'.jog';
      else if((/^rate$/.test(kl)||/tempo(slider|fader)/.test(kl))&&!/range|reset/.test(kl))id=d+'.pitch';
      else if(/^volume$|deckfader|volumefader|channelfader/.test(kl))id=x+'.vol';
      else if(/^pregain$|gainknob|trim/.test(kl))id=x+'.trim';
      else if(/parameter3$|eqknob\[3\]/.test(kl))id=x+'.hi';
      else if(/parameter2$|eqknob\[2\]/.test(kl))id=x+'.mid';
      else if(/parameter1$|eqknob\[1\]/.test(kl)&&/equalizer|eqknob/i.test(g+kl))id=x+'.lo';
      else if(/super1$|quickeffectknob|filterknob/.test(kl))id=x+'.flt';
      else if(/^pfl$|headphonecuebutton$/.test(kl))id=x+'.cue';
      else if((h=kl.match(/^hotcue_([1-8])_(activate|clear)$/))){id=d+'.hc'+h[1];if(h[2]==='clear')arg='clear'}
      else if((h=kl.match(/^beatloop_(2|4|8|16)_(toggle|activate)$/)))id=d+'.loop'+h[1];
      else if(/cycletemporange|temporange/.test(kl))id=d+'.range';
      else if(/^loop_in$|loopin/.test(kl))id=d+'.loopin';
      else if(/^loop_out$|loopout/.test(kl))id=d+'.loopout';
      else if(/^reloop_(toggle|exit)$|^reloop_andstop$|reloop/.test(kl))id=d+'.reloop';
      else if(/^loop_halve$|loophalve/.test(kl))id=d+'.lhalf';
      else if(/^loop_double$|loopdouble/.test(kl))id=d+'.ldouble';
      else if(/^sync_master$|^sync_leader$|syncmaster|syncleader/.test(kl))id=d+'.master'}
    if(!id&&/\[(Master|Mixer)\]/.test(g)){if(kl==='crossfader')id='xf';else if(kl==='headmix')id='cuemix';else if(kl==='headgain')id='phones';else if(kl==='gain')id='master'}
    if(id&&!out[key]){out[key]={id};if(arg)out[key].arg=arg;if(id.endsWith('.jog'))out[key].mode='auto'}}
  return{name,map:out}}
if(typeof module!=='undefined')module.exports=mixxxToMap;
