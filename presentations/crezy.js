var Resources = {
    map: [
        {id:"IT", color:"#CC0000"},
        {id:"US", color:"#00CC00"},
        {id:"VN", color:"#0000CC"},
        {id:"SK", color:"#0000CC"},
        {id:"CN", color:"#0000CC"}]
};
var crezyPresentation = {
    title: 'Crezy',
    description: 'Crezy is a presenting webapp based on impress.js',
    author: 'Luca Faggianelli',
    logo: '',
    slides: [
        {id:'home', name: 'First slide', description: 'Talking about crezy', x:0, y:0, elements: [

            {content:
'<h1 style="font-size:260px;text-shadow: 2px 2px 3px #FF4500;">Crezy</h1>\
<p style="position:absolute;bottom: 0px;left: 100px;font-size: 60px;">a presenting tool.</p>'},
        ]},
        {id:'chart', name: 'Charts', description: 'Do you need charts?', x: 500, y: 450, elements: [
            {content: '', type: 'chart', extra: [{x:'luca',y:20},{x:'davide',y:12}]},
            {content: 'This is a chart', type: 'text', extra: 'p', x: '50%', y: '0'}
        ]},
        {id:'map', name: 'Map', description: 'How cool is this map?', x: -400, y: 600, elements: [
            {content: '...or maybe a map?', type: 'text', extra: 'p', x: '50%', y: '-4%'},
            {content: '', type: 'map', extra: Resources.map}
        ]},
        {id:'imagination', name: 'Imagination', description: 'Forget borders', x:0, y:0, z:100, scale:2, showAfter:true, elements: [
            {content: 'presentations/imgs/neptune.png', type: 'img'},
            {content: 'Forget borders...', type: 'text', extra: 'p', x: '50%', y: '-4%'}
        ]},
        {id:'imagination2', name: 'Imagination2', description: 'Forget borders', x:-200, y:-200, z:200, scale:3, showAfter:true, elements: [
            {content: 'presentations/imgs/planet1.png', type: 'img'},
            {content: '...the limit it\'s your imagination!', type: 'text', extra: 'p', x: '50%', y: '-4%'}
        ]}
    ]
};
//{id: 'tank', content: 'presentations/imgs/tank.png', type: 'img'},
//{id: 'another', content: 'Sono Luca', x: 0, y: 100},
