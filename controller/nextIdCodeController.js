const NextIdCode = require('../models/nextIdCode');

const getNextIdCode = async (field) => {
    try {
        const dbResponse = await NextIdCode.find();
        if (!dbResponse || dbResponse.length === 0) {
            const skuid = 1;
            const bcCode = 1;
            const newNextIdCode = new NextIdCode(
                {
                    skuid: field === "skuid" ? skuid + 1 : skuid,
                    bcCode: field === "bcCode" ? bcCode + 1 : bcCode
                });
            const dbResponse = await newNextIdCode.save();
            return field === "skuid" ? skuid : field === "bcCode" ? bcCode : null;
        }
        else {
            const id = dbResponse._id;
            const skuid = dbResponse.skuid;
            const bcCode = dbResponse.bcCode;
            const dbResponse = await NextIdCode.updateOne(
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
            return field === "skuid" ? skuid : field === "bcCode" ? bcCode : null;
        }
    } catch (error) {
        console.log(error);
    }
}



module.exports = { getNextIdCode };