import { OutputType } from "@/models/AppRepo/Application";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving the output types",
    post: "Something unexpected went wrong saving the output type",
};

const http = createAxiosInstance(errorMessages);

export async function getAllOutputType(): Promise<OutputType[]> {
    const response = await http.get(`/app_store/output_types`);
    return response.data;
}

export async function createOutputType(outputType: OutputType): Promise<OutputType> {
    const response = await http.post(`/app_store/output_types`, outputType);
    return response.data;
}
