import { Internship } from '../models/Internship.ts';

const getAllInternship = async (ctx) => {
    try {
        const result = await Internship.all();
        ctx.response.status = 200;
        ctx.response.body = result;
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: error.toString
        };
    }
}

const getInternship = async (ctx) => {
    try {
        const result = await Internship.where('id', ctx.params.id).get();

        if(result.toString() === ""){
            ctx.response.status = 404;
            ctx.response.body = {
                success: false,
                message: "Internship not found."
            };
        }
        else {
            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                result: result
            };
        }

    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: error.toString()
        };
    }
}

const createInternship = async (ctx) => {

    let requestBody;
    try {
        requestBody = await ctx.request.body().value;

    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: error.toString()
        }
    }
    
    if(ctx.request.hasBody){

        if(requestBody.hasOwnProperty('title') && requestBody.hasOwnProperty('startDate') && requestBody.hasOwnProperty('endDate')){
            if(requestBody.hasOwnProperty('description')) {
                try {
                    await Internship.create({ description: requestBody.description,title: requestBody.title, startDate: requestBody.startDate, endDate: requestBody.endDate});
                } catch (error) {
                    ctx.response.status = 500;
                    ctx.response.body = {
                        success: false,
                        message: error.toString()
                    };
                } 
            }
            else {
                try {
                    await Internship.create({ title: requestBody.title, startDate: requestBody.startDate, endDate: requestBody.endDate});
                } catch (error) {
                    ctx.response.status = 500;
                    ctx.response.body = {
                        success: false,
                        message: error.toString()
                    };
                } 
            }
        }
        else {
            ctx.response.status = 400;
            ctx.response.body = {
                message: 'title, startDate and endDate fields need to be defined.'
            };
        }
        
    }
    else {
        ctx.response.status = 400;
        ctx.response.body = { 
            success: false,
            message: "Body missing." 
        };
    }
}

const updateIntership = async (ctx) => {
    const requestBody = await ctx.request.body().value;
    try {
        await Internship.where('id', ctx.params.id).update(requestBody);
        ctx.response.status = 200;
        ctx.response.body = { 
            success: true,
            message: `Internship ${ctx.params.id} updated` 
        };
    } catch (error) {
        ctx.response.body = {
            success: false,
            message: error.toString()
        }
    } 
}

const deleteInternship = async (ctx) => {
    try {
        await Internship.deleteById(ctx.params.id);
        ctx.response.status = 200;
        ctx.response.body = { message: `Internship ${ctx.params.id} deleted.` };
    
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: error.toString()
        };
    }
}

export {getAllInternship, getInternship, createInternship, updateIntership, deleteInternship};