const NextIdCode = require('../models-admin/nextIdCode');

const getNextIdCode = async (field) => {
    try {
        let dbResponse = await NextIdCode.find();
        if (!dbResponse || dbResponse.length === 0) {
            const skuid = 1;
            const bcCode = 1;
            const newNextIdCode = new NextIdCode(
                {
                    skuid: field === "skuid" ? skuid + 1 : skuid,
                    bcCode: field === "bcCode" ? bcCode + 1 : bcCode
                });
            await newNextIdCode.save();
            dbResponse = await NextIdCode.find();
            const id = dbResponse[0]._id;
            return {id, skuid, bcCode};
        }
        else {
            const id = dbResponse[0]._id;
            const skuid = dbResponse[0].skuid;
            const bcCode = dbResponse[0].bcCode;
            console.log(skuid);
            dbResponse = await NextIdCode.updateOne(
                { _id: id },
                {
                    $set:
                    {
                        skuid: field === "skuid" ? skuid + 1 : skuid,
                        bcCode: field === "bcCode" ? bcCode + 1 : bcCode
                    }
                });
            if (dbResponse && dbResponse.modifiedCount !== 0)
                console.log("Update successful");
            return {id, skuid, bcCode};
        }
    } catch (error) {
        console.log(error);
    }
}

const resetIdCode = async (id, field, value) => {
    const update = {}
    if(field === "skuid"){
        update.$set = {skuid: value};
    }
    else if(field === "bcCode"){
        update.$set = {bcCode: value}
    }
    else{
        console.log("Unknown field");
        return;
    }
    const dbResponse = await NextIdCode.updateOne(
        { _id: id }, update
    );
    if (dbResponse && dbResponse.modifiedCount !== 0)
        console.log("Reset successful");
}

module.exports = { getNextIdCode, resetIdCode };