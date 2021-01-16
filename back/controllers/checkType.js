module.exports = {
    checkISODate: (dateString) => {
        let date = new Date(dateString);
        
        if(date.toString() === "Invalid Date"){
            return false;
        }
        
        if(date.toISOString() !== dateString) {
            return false;
        }
        return true;
    },

    isInteger: (value) => {
        return !isNaN(value) && 
            parseInt(Number(value)) == value && 
            !isNaN(parseInt(value, 10));
    }
}