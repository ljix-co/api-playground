import React from 'react';
import { REQUEST_TIMEOUT_MAX_SECONDS, REQUEST_TIMEOUT_MIN_SECONDS } from '~/config';
import { Input, SelectInput, TextArea, Button, Form, ButtonStates, InputNumber } from '~/ui-components';
import { isValidJson, isValidTimeout, isValidUrl } from '~/utils/validations';
import { HttpMethods, PipelineStages, type HttpMethod } from '~/services/types';
import type { FormValues } from '~/ui-components/form/types';
import { useServiceContext } from '~/services/ServiceContext';

const RequestComposerSection: React.FC = () => {
    const { executeRequest, resetPipelineStage, pipelineStage } = useServiceContext();
    const [hasAdvancedOptions, setHasAdvancedOptions] = React.useState(false);

    const handleSubmit = async (values: FormValues) => {
        const { url, method, body, timeout } = values;
        await executeRequest(
            url as string,
            method as HttpMethod,
            body as string,
            {
                ...(timeout ? { timeout: Number(timeout) } : {})
            }
        );
    }

    return (
        <div className="p-4 m-4 layout-card">
            <Form
                name="APIForm"
                onSubmit={handleSubmit}
                onChange={resetPipelineStage}
                isDisabled={pipelineStage === PipelineStages.SENDING
                    || pipelineStage === PipelineStages.WAITING}
            >
                {(formValues, errors) => {
                    return (
                        <>
                            <div className='layout-row items-end'>
                                <Input
                                    name="url"
                                    label="API URL"
                                    placeholder="Enter API URL"
                                    validator={{
                                        validatorMethod: isValidUrl,
                                        errors: ["Please enter a valid URL"]
                                    }}
                                />
                                <SelectInput
                                    name="method"
                                    label="Method"
                                    options={Object.values(HttpMethods)}
                                    value={HttpMethods.GET}
                                />
                                <div className='w-1/4 mb-3'>
                                    <Button
                                        label='Send Request'
                                        type="submit"
                                        state={(pipelineStage === PipelineStages.SENDING || pipelineStage === PipelineStages.WAITING)
                                            || (errors && Object.values(errors).some(error => error.length > 0))
                                            ? ButtonStates.DISABLED
                                            : ButtonStates.DEFAULT
                                        }
                                    />
                                </div>
                            </div>
                            <div className='layout-stack'>
                                <div className='w-full h-full flex flex-col gap-4'>
                                    <p
                                        onClick={() => setHasAdvancedOptions(!hasAdvancedOptions)}
                                        className="text-blue-500 hover:underline cursor-pointer"
                                    >
                                        Additional options {hasAdvancedOptions ? '-' : '+'}
                                    </p>
                                    {hasAdvancedOptions && (
                                        <div className="w-1/3">
                                            <InputNumber
                                                name="timeout"
                                                label="Timeout (s)"
                                                placeholder="Enter timeout in seconds"
                                                min={REQUEST_TIMEOUT_MIN_SECONDS}
                                                max={REQUEST_TIMEOUT_MAX_SECONDS}
                                                validator={{
                                                    validatorMethod: (timeout) => isValidTimeout(timeout, REQUEST_TIMEOUT_MAX_SECONDS, REQUEST_TIMEOUT_MIN_SECONDS),
                                                    errors: [`Please enter a valid timeout between ${REQUEST_TIMEOUT_MIN_SECONDS} and ${REQUEST_TIMEOUT_MAX_SECONDS} seconds.`]
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                {(formValues.method === HttpMethods.POST || formValues.method === HttpMethods.PUT) && (
                                    <div className='w-1/2'>
                                        <TextArea
                                            name="body"
                                            label="Request Body"
                                            placeholder="Enter request body (for POST/PUT)"
                                            validator={{
                                                validatorMethod: (value) => isValidJson(value),
                                                errors: ["Please enter valid JSON"]
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )
                }}
            </Form>
        </div>
    )
};

export default RequestComposerSection;
