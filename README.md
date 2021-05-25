# magento2-hyva-checkout-payone
Payone Payment method for Hyvä Checkout

## Prerequisites

1. A working Magento site with **[Payone](https://github.com/PAYONE-GmbH/magento-2)** module installed and setup.
2. **[Hyvä Checkout](https://github.com/hyva-themes/magento2-hyva-checkout)** is installed and setup.

## How to use it with Hyvä Checkout?
This is a manual process. Below you will find the steps to integrate payone methods.

1. Copy `payone` directory you find in this repo into your Hyvä Checkout module. You need to place this directory at the path `src/reactapp/src/components/`. `payone` directory holds all the related react components and other helper functions.

2. You need to add certain CSS files and payone javascript files in the
hyvä checkout page. For this you need to update the layout xml file inside Hyvä Checkout module

    File: `src/view/frontend/layout/hyvacheckout_checkout_index.xml`
    ```
    <?xml version="1.0"?>
    <page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" layout="1column" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
        <head>
            ....
            <css src="Payone_Core::css/payolution.css"/>
            <css src="Payone_Core::css/creditcard.css"/>
            <css src="Payone_Core::css/klarna.css"/>
            <css src="Payone_Core::css/payone.css"/>
        </head>
        <body>
            <referenceContainer name="content">
                ...
                <block class="Payone\Core\Block\ClientApi"
                    name="payone_client_api"
                    template="Payone_Core::client_api.phtml" />
                <block class="Payone\Core\Block\RatepayDeviceFingerprint"
                    name="payone_ratepay_device_fingerprint"
                    template="Payone_Core::ratepay_device_fingerprint.phtml" />
            </referenceContainer>
            ...
        </body>
    </page>
    ```

3. You need to pass the payment configurations into the react application. We have already created a viewModel to achieve this. You can find this viewModel at `src/ViewModel/CheckoutConfigProvider.php`. To do this, you need to fill the `data-payment` attribute of the react app root element.

    File: `src/view/frontend/templates/react-container.phtml`
    ```
    <?php
    ...
    /** @var \Magento\Framework\Escaper $escaper */
    /** @var \Hyva\Checkout\ViewModel\CheckoutConfigProvider $configProvider */
    $configProvider = $block->getCheckoutConfigProvider();
    ...
    ?>
    <div
        id="react-checkout"
        ...
        data-payment="<?= $escaper->escapeHtmlAttr($configProvider->getConfig())  ?>"
    >
    ...
    </div>
    ```

4. It is time to add custom payment renderers in the react app. This way we will use the payone react components in order to render the payment option in the checkout page. This is simple to do

    File: `src/reactapp/src/components/paymentMethod/customRenderers.js`

    ```
    import CreditCard from '../payone/components/creditCard/CreditCard';

    export default {
    payone_creditcard: CreditCard,
    };
    ```
    As you can see above, we just added payone-creditcard component in the custom payment render list. Now, if the payone-creditcard option is available in the checkout, then the `CreditCard` component will be used to render the payone-creditcard payment option.

5. Finally, we need to build the app again. For this, you need to run `npm run build` from the root directory of Hyvä Checkout module. After this, if you navigate to the checkout page from your site, then you will see all the payone options you have configured in the above step.

## More Reading

- If you have any doubts about the building the react app, then **[read more about it here](https://hyva-themes.github.io/magento2-hyva-checkout/build/)**.
- If you want to know more about how Hyvä Checkout helps you to integrate any payment methods, then **[read more about it here](https://hyva-themes.github.io/magento2-hyva-checkout/payment-integration/)**.
- The official documentation of **[Hyvä Checkout](https://hyva-themes.github.io/magento2-hyva-checkout)**
- The documenation of **[Payone](https://github.com/PAYONE-GmbH/magento-2)** module
