var calculator = {
    screenOut: document.querySelectorAll('.screenOut')[0],
    screenOutMini: document.querySelectorAll('.screenOutMini')[0],
    result: '',
    numArray: [],
    opArray: [],
    tempInput: '',
    tempArray: [],
    lastInput: '',

    //region what we have to press and what we do // ( x ) event obj   ==> readInput( x )
    readInput: function (e) {
        var warningElm = document.querySelectorAll('.warning-left')[0];
        (this.screenOut.innerHTML === '0' )?  this.screenOut.innerHTML = this.screenOutMini.innerHTML = '' : '';
        var inNum = e.getAttribute('data-value');
        this.charLength();
        warningElm ? warningElm.remove() : '';
        // I love switch ^^ // what we have to press
        switch (inNum) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
            case '.':
                this.screenOutMini.innerHTML += inNum;
                this.tempInput += inNum;
                this.lastInput += inNum
                this.screenPut(inNum);
                this.charLength();
                break;
            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
                this.screenOutMini.innerHTML += inNum;
                this.numArray.push( this.tempInput );
                this.opArray.push( inNum );
                this.tempInput += inNum;
                this.screenPut( inNum );
                this.lastInput = ''
                this.charLength();
                break;
            case '=':
                this.calculate();
                this.lastInput = ''
                break
            case 'c':
                this.clearScreen();
                break;
            case 'pm':
                this.plusMinus();
                break;
        }
    },
    //endregion

    //region writing at the screen  (X) the last input ==> screenPut( x )
    screenPut: function ( value ) {
        //we put only the value that we have not the operator signe
        let temp = this.tempInput[this.tempInput.length-2]
        if ( value !== '+' && value !== '-' && value !== '*' && value !== '/' && value !== '%' ) {
             if ( temp !== '+' && temp !== '-' && temp !== '*' && temp !== '/' && temp !== '%' ) {
                 if (!this.result) {
                     this.screenOut.innerHTML += value;
                 } else {
                     this.clearScreen()
                     //this.screenOut.innerHTML = value;
                 }
             } else {
                 this.screenOut.innerHTML = '';
                 this.screenOut.innerHTML += value;
             }
        }
    },
    //endregion

    //region Reset and clear the screen ==> clearScreen()
    clearScreen: function () {
        // clear our screen and all data // like restart from the beginning
        this.screenOut.innerHTML = '0';
        this.screenOutMini.innerHTML = '0';
        this.result = '';
        this.numArray = [];
        this.opArray = [];
        this.tempInput = '';
        // if the size was modified
        this.screenOut.style.fontSize = '1.45em'
        this.screenOut.style.top = '74px'
        this.screenOutMini.style.fontSize = '.65em'
        this.lastInput = ''
    },
    //endregion

    //region Character size ==> charLength()
    charLength: function () {
        // we change the font size if we have big number
        if (this.screenOut.innerHTML.length > 13) {
            this.screenOut.style.fontSize = '.9em'
            this.screenOut.style.top = '84px'
        }
        if (this.screenOut.innerHTML.length > 21) {
            this.screenOut.style.fontSize = '.6em'
            this.screenOut.style.top = '86px'
        }
        if (this.screenOutMini.innerHTML.length > 31) {
            this.screenOutMini.style.fontSize = '.48em'
        }
        if (this.screenOut.innerHTML.length <= 13) {
            this.screenOut.style.fontSize = '1.45em'
            this.screenOut.style.top = '74px'
        }
        if (this.screenOutMini.innerHTML.length <= 31) {
            this.screenOutMini.style.fontSize = '.65em'
        }

    },
    //endregion

    //region Calculate ==> calculate()
    calculate: function () {
        var num1 = 0;
        var num2 = 0;
        var numDot = 0;
        var op = '';
        var arrayTemp = [];
        // we check if we continue our calculation or if it is a new calculation // continue ==> giv old result to num 1, or we do nothing if new action
        this.result ? num1 = this.result : '';
        // we build our array with numbers and operators
        for (var i = 0; i < this.tempInput.length; i++ ) {
            if ( this.tempInput[i] !== '+' && this.tempInput[i] !== '-' && this.tempInput[i] !== '*' && this.tempInput[i] !== '/' && this.tempInput[i] !== '%' )  {
                // we check if we have a dot
                if (this.tempInput[i] === '.') {
                    numDot = 1;
                }
                num1 += this.tempInput[i] ;
            } else {
                // if the number has a dot we convert to float
                numDot > 1 ? num1 = parseFloat(num1) : num1 *= 1;
                arrayTemp.push(num1)
                op = this.tempInput[i];
                arrayTemp.push(op);
                num2 = num1;
                num1 = 0;
            }
        }
        // convert to number
        num1 *= 1;
        //we push the last one
        arrayTemp.push(num1)
        for (var k=1; k < arrayTemp.length-1; k++ ) {
            k === 1 ? num2 = arrayTemp[0] : num2 = this.result;
            op = arrayTemp[k];
            num1 = arrayTemp[k+1] ;
            // we check which operator we have

            // we start our operation with num2 because he is the first input
            op === '+' ? this.result = num2 + num1 : '';
            op === '-' ? this.result = num2 - num1 : '';
            op === '*' ? this.result = num2 * num1 : '';
            op === '/' ? this.result = num2 / num1 : '';
            op === '%' ? this.result = num2 % num1 : '';
        }
        this.screenOut.innerHTML = this.result;
        this.screenOutMini.innerHTML += '=' + this.result
        this.charLength();
        this.tempInput = [];
        op ===  '%' ? this.addWarnings('Modulo not %'): '';
    },
    //endregion

    //region +/- ==> plusMinus()
    plusMinus: function () {
        var val = this.screenOut.innerHTML
        if (this.result) {
            var numSign = Math.sign( val );
            var num = val;
            if (numSign > 0 ) {
                num = -Math.abs(num);
            } else if (numSign < 0 ) {
                num = Math.abs(num)
            }
            this.screenOut.innerHTML = num;
            this.result = num;
        } else {
            this.addWarnings( 'only result')
        }
    },
    //endregion

    //region Add warning ==> addWarning()
    addWarnings: function (text) {
        var creatElm = document.createElement('span');
        creatElm.classList.add('warning-left');
        creatElm.innerHTML = text;
        this.screenOut.appendChild(creatElm);
    }
    //endregion

};