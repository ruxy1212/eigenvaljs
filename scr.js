var oform = document.querySelector('body form'), rform = document.querySelector('.question div'), rspan = document.querySelector('.question span'), qform = document.querySelector('.qform'), controls = document.querySelector('.controls');
var nVar, nDec, w, x, y, z;
var result = document.querySelector('.result');

oform.addEventListener('submit', function(e){
    e.preventDefault();
    var opts = oform.querySelectorAll('select');
    nVar = opts[0].value;
    nDec = opts[1].value;
    if(nVar == 'cubic'){
        rform.innerHTML = `<input type="hidden" value="${nVar}"/><div class="fgroup"><label>a = </label><input required type="number"></div><div class="fgroup"><label>b = </label><input required type="number"></div><div class="fgroup"><label>c = </label><input required type="number"></div><div class="fgroup"><label>d = </label><input type="number"></div>`;
        controls.innerHTML = '<input class="btn" type="submit" value="Calculate"/><a href="javascript:void(0);" onclick="resetForm()" class="btn">Reset</a>';
        rspan.innerHTML = '<h3>EQUATION:</h3><i><b>a</b>λ<sup>3</sup> + <b>b</b>λ<sup>2</sup> + <b>c</b>λ + <b>d</b> = 0</i>';
    }else{
        rform.innerHTML = `<input type="hidden" value="${nVar}"/><div class="fgroup"><label>a = </label><input required type="number"></div><div class="fgroup"><label>b = </label><input required type="number"></div><div class="fgroup"><label>c = </label><input required type="number"></div>`;
        controls.innerHTML = '<input class="btn" type="submit" value="Calculate"/><a href="javascript:void(0);" onclick="resetForm()" class="btn">Reset</a>';
        rspan.innerHTML = '<h3>EQUATION:</h3><i><b>a</b>λ<sup>2</sup> + <b>b</b>λ + <b>c</b> = 0</i>';
    }
});

qform.addEventListener('submit', function(e){
    e.preventDefault();
    var rinput = rform.querySelectorAll('input');
    z = rinput[rinput.length-1].value; 
    y = rinput[rinput.length-2].value; 
    x = rinput[rinput.length-3].value; 
    w = (rinput[0].value == 'cubic')?rinput[1].value:0;

    var res = solve(w,x,y,z);

    if(res.length>0){
        res.sort(function(a,b){return b-a});
        w=(w==1)?'':w;x=(x==1)?'':x;y=(y==1)?'':y;z=(z==1)?'':z;
        var resT = rinput[0].value;
        var resE = (resT == 'cubic') ? `<i><b>${w}</b>λ<sup>3</sup> + <b>${x}</b>λ<sup>2</sup> + <b>${y}</b>λ + <b>${z}</b> = 0</i>` : `<i><b>${x}</b>λ<sup>2</sup> + <b>${y}</b>λ + <b>${z}</b> = 0</i>`;
        var resR = '';
        var resQ = '';
        for(var i=0; i<res.length; i++){
            val = res[i].toFixed(nDec);
            if(val != 0){
                var vol = val*(-1);
                resQ += (val>0)?`(λ${vol})` : `(λ+${vol})`;
            }
            resR += `<i><b>Root ${i+1}:</b> ${val}</i><br>`;
        }
        for(var i=0; i<res.length; i++){
            val = res[i].toFixed(nDec);
            if(val == 0){
                resQ = 'λ'+resQ;
            }
        }
        resQ += ' = 0';
        result.innerHTML = `<h3>RESULT</h3><div><h4>Type:&emsp;</h4><span class="flet">${resT}</span></div><div><h4>Equation:&emsp;</h4><span>${resE}</span></div><div><i>${resQ}</i></div><div><div><h4>Roots:&emsp;</h4><span>${resR}</span></div></div>`;
    }else{
        result.innerHTML = '<h3>RESULT</h3><h4>Error! check your equations.</h4>';
    }
});
function root(x){
    var y = Math.pow(Math.abs(x), 1/3);
    return (x < 0)? -y : y;
}
function solve(a,b,c,d){
    if(Math.abs(a) < 1e-8){
        a = b; b = c; c = d;
        if(Math.abs(a) < 1e-8){
            a = b; b = c;
            if(Math.abs(a) < 1e-8) return [];
            return [-b/a];
        }
        var D = b*b - 4*a*c;
        if(Math.abs(D) < 1e-8) return [-b/(2*a)];
        else if (D > 0) return [(-b+Math.sqrt(D))/(2*a), (-b-Math.sqrt(D))/(2*a)];
        return [];
    }
    var p = (3*a*c - b*b)/(3*a*a), q = (2*b*b*b - 9*a*b*c + 27*a*a*d)/(27*a*a*a), roots;
    if(Math.abs(p) < 1e-8) roots = [root(-q)];
    else if(Math.abs(q) < 1e-8) roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
    else {
        var D = q*q/4 + p*p*p/27;
        if(Math.abs(D) < 1e-8) roots = [-1.5*q/p, 3*q/p];
        else if(D>0){
            var u = root(-q/2 - Math.sqrt(D));
            roots = [u - p/(3*u)];
        }else{
            var u = 2*Math.sqrt(-p/3);
            var t = Math.acos(3*q/p/u)/3;
            var k = 2*Math.PI/3;
            roots = [u*Math.cos(t), u*Math.cos(t-k), u*Math.cos(t-2*k)];
        }
    }
    for(var i=0; i<roots.length; i++) roots[i] -= b/(3*a);

    return roots;
}
function resetForm(){
    qform.reset();
}
function openCD(){
    document.querySelector('main').style.display = "none";
    document.querySelector('aside').style.display = "block";
    document.querySelector('.open-cd').style.opacity = 0.3;
    document.querySelector('.open-cd').style.pointerEvents = "none";
}

function hideCD(){
    document.querySelector('main').style.display = "block";
    document.querySelector('aside').style.display = "none";
    document.querySelector('.open-cd').style.opacity = 1;
    document.querySelector('.open-cd').style.pointerEvents = "unset";
}

document.addEventListener('mouseup', function (e) { 
    var con = document.querySelector('aside');
    var extbtn = document.querySelector('aside div');
    if(!con.contains(e.target) && !extbtn.contains(e.target)) hideCD();
});

// var ans = solve(1,-11,36,-36);
// var ans = solve(0,1,12,32)