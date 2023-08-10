(function () {

    'use strict';

    const numButtons = document.querySelectorAll('.numButton');

    const operatorButtons = document.querySelectorAll('.calcButton');

    let display = document.getElementById('screen');

    const inputEntries = document.getElementById('inputEntries');

    const options = document.querySelectorAll('.options');

    const discountButton = document.getElementById('discountedClient');

    const standardClientButton = document.getElementById('standardClient');

    const saveButton = document.getElementById('save');

    const enter = document.getElementById('enter');

    let ulForNewerCalc = []; //rec12 added to divide list into two

    ulForNewerCalc['gross'] = document.getElementById('afterEqualList'); //rec12

    ulForNewerCalc['expenses'] = document.getElementById('afterEqualList2'); //rec12

    const clearButton = document.getElementById('clear');

    //rec12 (not needed) const totalsCalculator = document.getElementById('resultsTotal');  hl-if not using button to calculate total, using autoCalc instead

    const clearAllResults = document.getElementById('clearAllResults');

    const clearSingleResult = document.getElementById('clearResult');

    //rec6 key constants start
    const fedtax = 0.17; //rec12 based on spreadsheet

    const NYtax = 0.057; //rec12 based on spreadsheet

    const loctax = 0.0; // no info

    const standardMaaser = .1;

    const stdClient = 250;

    const disClient = 200;  //default. Can enter other amount
    //rec6 key constants end

    document.getElementById('date').valueAsDate = new Date(); //rec4.12

    function totalBox(html, target) { //added target parameter to define which div to go into 
        let totalBoxElement = document.createElement('div');

        totalBoxElement.setAttribute('style', 'color: red');

        totalBoxElement.innerHTML = html;

        document.getElementById('totals' + target).innerHTML = totalBoxElement.outerHTML;
    }

    function addToList(textContent) {

        let li = document.createElement('li');

        li.textContent = textContent;

        //rec12 (going directly to ulForNewerCalc) 

        let target = 'gross';
        if (textContent.includes('expenses')) {
            target = 'expenses';
        }
        ulForNewerCalc[target].append(li);
    }


    options.forEach(opt => {

        opt.addEventListener('change', (e) => {

            //reset values when pulldown target changes
            display.innerText = '';
            a = '';
            b = '';
            equalClicked = false;
            calcStr = " [ ";

            ctarget = e.target.value; //rec2 drives arrays, results, bassed on pull down

            //rec6 in case ctarget array not previously initialized
            //maybe I could do this in the else?
            if (resultsArray[ctarget] === undefined) {
                resultsArray[ctarget] = [];
            }

            if (ctarget === 'taxes') {
                calcTaxes();
            }
            else if (ctarget == 'maaser') {
                calcMaaser();
            }
            else {
                console.log(`I am  ${ctarget}`);
            }

        });

    });

    enter.addEventListener('click', e => {
        e.preventDefault();

        resultsArray[ctarget].push(Number(inputEntries.value));
        autoCalc(ctarget); //rec12
        addToList('Entry for ' + ctarget + ': Amount: $' + Number(inputEntries.value));
        console.log('enter being clicked and adding to list', resultsArray[ctarget]);

    });

    function resultsCalculatorFunc(target) { //rec5-added //rec6 so can be called from autoCalc
        if (target === "gross" || target === "expenses") {
            let resultsTotal = arrayTotal(target);

            totalBox(target + ":" + resultsTotal, target);
        }
    }

    //rec6 globally initialize more variables
    let a = '';

    let b = '';

    let operator = '';

    let preOperator = true;

    let equalClicked = false;

    let calcStr = " [ "; //added to show the numbers and operators of a result 

    let resultsArray = [];

    let theResult;

    let lastButton = ''; // fixes bug when last button is operator

    let ctarget = 'gross';
    resultsArray['gross'] = [];

    resultsArray['maaser'] = [];

    let yes = document.getElementById('yes');

    let no = document.getElementById('no');

    let confirmed = false;

    //rec12 uncommented and incorporated
    /**/ function confirmOrContinue() {
        document.getElementById('confirmLabel').innerHTML = calcStr + theResult + "<br>"; //rec12
        document.getElementById('random').show();

        document.querySelectorAll('.confirm').forEach(choice => {
            choice.addEventListener('click', () => {
                if (yes) {
                    confirmed = true;
                    console.log('yes')
                }
                else {
                    console.log('no')
                }
            })
        })
    };

    operatorButtons.forEach(but => {

        but.addEventListener('click', (e) => {

            if (e.target.textContent == '=') {
                calcStr += " ] = ";
                if (operator != '') { //rec prevents multiple =

                    equalClicked = true;

                    preOperator = true;

                    theResult = calculate(operator);

                    operator = ''; //rec

                    confirmOrContinue();
                    //document.getElementById('confirmLabel').innerHTML = calcStr + theResult + "<br>";
                    //document.getElementById('random').show();

                    console.log('I am the theResult ' + theResult, 'I am A ' + a);

                    a = theResult;

                    b = '';

                    display.innerText = a;

                    //confirmOrContinue(); //rec12 incorporated so could remove need for pastResult
                }

            } else {

                if (operator != '') {
                    a = calculate(operator);
                }

                if (equalClicked) { //rec3 operator pressed right after =, so remove result from array and continue current calculation
                    resultsArray[ctarget].pop();
                }

                equalClicked = false;

                display.innerText = a;

                preOperator = false;

                operator = e.target.textContent;

            }

            calcStr += " " + operator + " ";

            lastButton = e.target.textContent;

        });

    });

    function calcTaxes(json) { //rec10 added json parameter so it returns taxes
        let diff = arrayTotal('gross') - arrayTotal('expenses');
        let taxtot = fedtax + NYtax + loctax;
        /**/if (json == 'json') {
            return (diff * taxtot).toFixed(2);
        }

        totalBox("gross - expenses: $" + diff + "<br>" + taxtot * 100
            + "% taxes: " + (diff * taxtot).toFixed(2), 'taxes');
    }

    // function to calculate Maaser
    function calcMaaser(json) {  //rec10 added json parameter so it returns maaser
        let taxtot = fedtax + NYtax + loctax;

        let diff = (arrayTotal('gross') - arrayTotal('expenses')) * (1 - taxtot);

        let netMaaser = diff * standardMaaser - arrayTotal('maaser');

        if (json == 'json') {
            return netMaaser.toFixed(2);
        }

        totalBox("gross - expenses - taxes : $" + diff.toFixed(2) + "<br>" + standardMaaser * 100
            + "% maaser - discounts: $" + netMaaser.toFixed(2)
            + "<br> net Income: $" + (diff - netMaaser).toFixed(2), 'maaser');
    }

    function calcNet(json) { //rec12 added for json conversion of netIncome
        let taxtot = fedtax + NYtax + loctax; //rec12

        let diff = (arrayTotal('gross') - arrayTotal('expenses')) * (1 - taxtot); //rec12

        let netMaaser = diff * standardMaaser - arrayTotal('maaser'); //rec12

        if (json == 'json') { //rec12
            return (diff - netMaaser).toFixed(2); //rec12
        } //rec12
    }

    /**/yes.addEventListener('click', () => {
        resultsArray[ctarget].push(theResult);
        autoCalc(ctarget); //rec12
        addToList('Entry for ' + ctarget + ': Amount: ' + calcStr + '$' + theResult);
        console.log('I am the results array', resultsArray[ctarget]);
    });
    //rec2
    no.addEventListener('click', () => {
        calcStr = '';
        theResult = 0;
        display.innerText = '0';
        console.log('nothing comes from nothing');
    });

    standardClientButton.addEventListener('click', () => {

        resultsArray['gross'].push(stdClient);
        display.innerText = stdClient;
        //prompt('please press Yes to add the entry or click No to continue calculating');
        theResult = stdClient;
        equalClicked = true;
        autoCalc('gross');
        a = theResult;
        b = '';
        addToList('Standard client (gross): $' + stdClient);
    });

    discountButton.addEventListener('click', () => {
        if (equalClicked) {
        }
        let discount = prompt("Enter the amount charged to the client: ", disClient);
        equalClicked = true;
        theResult = stdClient - discount;
        console.log('what is discount' + discount);
        resultsArray['gross'].push(Number(discount));
        autoCalc('gross');
        a = discount;
        b = '';
        display.innerText = a;
        console.log('I am the results array', resultsArray[ctarget]);

        //need to do something here to show that this is paid maaser not owed
        resultsArray['maaser'].push(theResult);
        autoCalc(ctarget);
        addToList('Client with deduction (gross): $' + Number(discount));

    });

    //autoCalc_function
    function autoCalc(target) { //rec12
        resultsCalculatorFunc(target); //rec12
        if (document.getElementById('totalstaxes').innerHTML != "") { //rec6 if taxes have been requested, will update //rec12
            calcTaxes(); //rec12
        } //rec12
        if (document.getElementById('totalsmaaser').innerHTML != "") { //rec6 if maaser? have been requested, will update //rec12
            calcMaaser();
        }
    }


    clearAllResults.addEventListener('click', () => {
        display.innerText = '0';
        equalClicked = false;
        a = '';
        b = '';
        resultsArray[ctarget] = [];
        document.getElementById('totals' + ctarget).innerHTML = "";
        resultsList.innerHTML = "";
        ulForNewerCalc[ctarget].innerHTML = "";
        if (ctarget == 'gross') { //rec6-remove maaser credits //rec12
            resultsArray['maaser'];
        }
        autoCalc(ctarget);
    });

    clearSingleResult.addEventListener('click', () => {

        let target = 'gross';
        let remove = prompt("Which result to remove?", 0);
        if (remove <= 0) {
        } else if ((ctarget == 'gross' || ctarget == 'expenses') && remove <= ulForNewerCalc[ctarget].childElementCount) { //rec6 prevent childElementCount undefined by check ctarget first
            if (ctarget == 'gross' && ulForNewerCalc[ctarget].children[remove - 1].innerHTML.includes('discount')) { //rec6 check for maaser credit
                alert("Need logic to remove the correct maaser credit");
            }
            ulForNewerCalc[ctarget].removeChild(ulForNewerCalc[ctarget].children[remove - 1]);
            resultsArray[ctarget] = resultsArray[ctarget].slice(0, remove - 1).concat(resultsArray[ctarget].slice(remove));
            target = ctarget;
        }
        autoCalc(target);
    });

    clearButton.addEventListener('click', () => {

        a = '';

        b = '';

        preOperator = true;

        display.innerText = '0';

    });

    function calculate(sign) {
        let result = 0;

        a = Number(a);
        if ("X-+".includes(lastButton)) { // fix last button being operator problem
            return a;
        }

        b = Number(b);

        switch (sign) {

            case 'X':

                result = a * b;

                break;

            case '-':

                result = a - b;

                break;

            case '+':

                result = a + b;

                break;

            case '/':
                result = a / b;

                break;
        }

        return result;

    }

    function arrayTotal(ctarget) {

        if (resultsArray[ctarget] != undefined && resultsArray[ctarget].length > 0) { // undefined check    
            return resultsArray[ctarget].reduce((a, c) => a + c);
        } else {
            return 0;
        }
    }

    display.innerText = '0';

    function numberButtons() {

        numButtons.forEach(but => {

            but.addEventListener('click', function (e) {

                if (equalClicked) {

                    display.innerText = '';

                    a = '';

                    b = '';

                    equalClicked = false;

                    calcStr = " [ ";
                }

                if (display.innerText === '0') {

                    if (preOperator) {

                        a = but.innerText;

                        console.log('a', a);

                    }

                    else {

                        display.innerText = '';

                        b = but.innerText;

                        console.log('b?', b);

                    }

                    display.innerText = but.innerText;

                }

                else if (display.innerText == a && !preOperator) {

                    b = but.innerText;

                    console.log('b', b);

                    display.innerText = but.innerText;

                }

                else {

                    if (preOperator) {

                        a += but.innerText;

                        console.log('a+', a);

                    }

                    else {

                        b += but.innerText;

                        console.log('b+', b);

                    }

                    display.innerText += but.innerText;

                }
                calcStr += but.innerText;

                lastButton = e.target.textContent;

            });

        });
    }

    saveButton.addEventListener('click', () => {
        const jsonStr = JSON.stringify({
            date: (document.getElementById('date').value),
            gross: (arrayTotal('gross')),
            expenses: (arrayTotal('expenses')),
            taxes: (calcTaxes('json')),
            maaser: (calcMaaser('json')),
            netIncome: (calcNet('json'))
        });
        console.log(jsonStr);
        saveJson(jsonStr);
    });

    async function saveJson(jsonStr) {

        /* const res = await fetch("/calc", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: jsonStr
        }).then(res => res.text()
        ).then(text => alert(text)
        ); */
        const response = await fetch('/calc', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: jsonStr
        });
        const posted = response.text();
        alert(posted);
    }

    numberButtons();

})();     