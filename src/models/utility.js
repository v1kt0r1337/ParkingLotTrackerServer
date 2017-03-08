/**
 * Created by archheretic on 26.02.17.
 */
let utility = {
    parseRowDataIntoSingleEntity: function(rowdata)
    {
        rowdata = JSON.stringify(rowdata);
        // console.log(rowdata);
        rowdata = JSON.parse(rowdata)[0];
        return rowdata;
    }
};
module.exports = utility;