var suffixes = ['', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

function formatNumber(value, precision)
{  
    //only apply suffixes from +-million and onwards
    if(Math.abs(value) >= 1000000){
        //get rid of decimals and the minus sign, and save the length of the string representation -> number of digits
        var value_Length = Math.round(Math.abs(value)).toString().length;
        //see how much 10^base is, if value_Length is a multitude of 3, leave 3 numbers, so we get 500 M and not 0.500 B
        var base = value_Length-((value_Length%3===0)?3:value_Length%3);
        //calculate mantissa
        var a = value/(Math.pow(10,base));
        //calculate suffix based on base 
        var suffixIndex = (base/3)-1;
        //construct output, infinity if the number is so large that the suffixes can't handle it
        value = (suffixIndex > suffixes.length) ? "Infinity" : a.toFixed(precision) + suffixes[suffixIndex];
    }
    //if value is of type string we alread constructed it, if not, the original value was smaller than 1mil, so fix the decimals
    return ( typeof value === 'string') ? value : value.toFixed(precision);    
}
