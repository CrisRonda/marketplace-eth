import { useState, useEffect } from 'react';

import { Button } from '@components/ui/common';
import { Modal } from '@components/ui/course';
import { useEthPrice } from '@components/hooks/useEthPrice';

const defaultOrder = {
    price: 0,
    email: '',
    confirmationEmail: ''
};
const _createFormState = (isDisabled = false, message = '') => {
    return { isDisabled, message };
};
const createFormState = (
    { price, email, confirmationEmail },
    hasAgreedTOS,
    isNewPurchase
) => {
    if (isNewPurchase) {
        if (confirmationEmail.length == 0 || email.length === 0) {
            return _createFormState(true, 'Please enter a valid email');
        }
        if (email !== confirmationEmail) {
            return _createFormState(
                true,
                'Email and confirmation email are not matching'
            );
        }
    }
    if (!price || Number(price) === 0) {
        return _createFormState(true, 'Please enter a valid price');
    }

    if (!hasAgreedTOS) {
        return _createFormState(true, 'Please agree to the terms of service');
    }
    return _createFormState(false);
};

const OrderModal = ({ course, onClose, onSubmit, isNewPurchase }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [order, setOrder] = useState(defaultOrder);
    const [enablePrice, setEnablePrice] = useState(false);
    const [hasAgreedTOS, setHasAgreedTOS] = useState(false);
    const { eth } = useEthPrice();
    useEffect(() => {
        if (!!course) {
            setIsOpen(true);
            setOrder({ ...defaultOrder, price: eth.pricePerCourse });
        }
    }, [course, eth.pricePerCourse]);

    const closeModal = () => {
        setIsOpen(false);
        onClose?.();
        setEnablePrice(false);
        setHasAgreedTOS(false);
        setOrder(defaultOrder);
    };
    const formState = createFormState(order, hasAgreedTOS, isNewPurchase);

    return (
        <Modal isOpen={isOpen}>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className="mt-3  sm:mt-0 sm:ml-4 sm:text-left">
                            <h3
                                className="mb-7 text-lg font-bold leading-6 text-gray-900"
                                id="modal-title"
                            >
                                {course.title}
                            </h3>
                            <div className="mt-1 relative rounded-md">
                                <div className="mb-1">
                                    <label className="mb-2 font-bold">
                                        Price(eth)
                                    </label>
                                    <div className="text-xs text-gray-700 flex">
                                        <label className="flex items-center mr-2">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox"
                                                checked={enablePrice}
                                                onChange={({
                                                    target: { checked }
                                                }) => {
                                                    setOrder({
                                                        ...order,
                                                        price: checked
                                                            ? order.price
                                                            : eth.pricePerCourse
                                                    });
                                                    setEnablePrice(checked);
                                                }}
                                            />
                                        </label>
                                        <span>
                                            Adjust Price - only when the price
                                            is not correct
                                        </span>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    name="price"
                                    id="price"
                                    disabled={!enablePrice}
                                    value={order.price}
                                    onChange={({ target: { value } }) => {
                                        if (isNaN(value)) return;
                                        setOrder({ ...order, price: value });
                                    }}
                                    className="disabled:opacity-50 w-80 mb-1 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
                                />
                                <p className="text-xs text-gray-700">
                                    Price will be verified at the time of the
                                    order. If the price will be lower, order can
                                    be declined (+- 2% slipage is allowed)
                                </p>
                            </div>
                            {isNewPurchase && (
                                <>
                                    <div className="mt-2 relative rounded-md">
                                        <div className="mb-1">
                                            <label className="mb-2 font-bold">
                                                Email
                                            </label>
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={order.email}
                                            onChange={({
                                                target: { value }
                                            }) => {
                                                setOrder({
                                                    ...order,
                                                    email: value.trim()
                                                });
                                            }}
                                            className="w-80 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
                                            placeholder="x@y.com"
                                        />
                                        <p className="text-xs text-gray-700 mt-1">
                                            It&apos;s important to fill a
                                            correct email, otherwise the order
                                            cannot be verified. We are not
                                            storing your email anywhere
                                        </p>
                                    </div>
                                    <div className="my-2 relative rounded-md">
                                        <div className="mb-1">
                                            <label className="mb-2 font-bold">
                                                Repeat Email
                                            </label>
                                        </div>
                                        <input
                                            type="email"
                                            name="confirmationEmail"
                                            value={order.confirmationEmail}
                                            onChange={({
                                                target: { value }
                                            }) => {
                                                setOrder({
                                                    ...order,
                                                    confirmationEmail:
                                                        value.trim()
                                                });
                                            }}
                                            id="confirmationEmail"
                                            className="w-80 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
                                            placeholder="x@y.com"
                                        />
                                    </div>
                                </>
                            )}
                            <div className="text-xs text-gray-700 flex mt-5">
                                <label className="flex items-center mr-2">
                                    <input
                                        checked={hasAgreedTOS}
                                        onChange={({ target: { checked } }) => {
                                            setHasAgreedTOS(checked);
                                        }}
                                        type="checkbox"
                                        className="form-checkbox"
                                    />
                                </label>
                                <span>
                                    I accept Eincode &apos;terms of
                                    service&apos; and I agree that my order can
                                    be rejected in the case data provided above
                                    are not correct
                                </span>
                            </div>
                            {formState.message && (
                                <div className="py-4 my-3 text-red-700 bg-red-200 rounded-lg text-sm px-4">
                                    {formState.message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex">
                    <Button
                        disabled={formState.isDisabled}
                        onClick={() => onSubmit(order, course)}
                    >
                        Submit
                    </Button>
                    <Button variant="red" onClick={closeModal}>
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default OrderModal;
