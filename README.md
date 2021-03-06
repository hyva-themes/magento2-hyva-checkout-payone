# magento2-hyva-checkout-payone
Payone Payment method for the Hyvä React Checkout

## Prerequisites

1. A working Magento site with **[Payone](https://github.com/PAYONE-GmbH/magento-2)** module installed and setup.
2. **[Hyvä Checkout](https://github.com/hyva-themes/magento2-react-checkout)** is installed and setup.

## How to use it with Hyvä Checkout?
Below you will find the steps to integrate payone methods.

1. You need to add certain CSS files and payone javascript files in the hyvä checkout page. For this you need to update the layout xml file inside Hyvä Checkout module

    File: `src/view/frontend/layout/hyvacheckout_checkout_index.xml`
    ```
    <?xml version="1.0"?>
    <page xmlns:xsi="0http://www.w3.org/2001/XMLSchema-instance" layout="1column" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
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

2. It is time to add the payone react components to the Hyvä Checkout. Add below code in your `package.json`.

    File: `src/reactapp/package.json`
    ```
    "config": {
        "paymentMethodsRepo": {
            "payone": "git@github.com:hyva-themes/magento2-hyva-checkout-payone.git"
        }
    },
    ```

    If you are using [**Hyvä Checkout Example Template**](https://github.com/hyva-themes/magento2-checkout-example), then you should use below configuration instead of above.

    File: `src/reactapp/package.json`
    ```
    "config": {
        "paymentMethodsRepo": {
            "payone": "git@github.com:hyva-themes/magento2-hyva-checkout-payone.git -b hyva-checkout-example-template"
        }
    },
    ```

    With this code in `package.json` and running `npm install`, then you are all set. This repo will be copied into the Hyvä Checkout and configured correctly.

3. Finally, we need to build the app again. For this, you need to run `npm run build` from the root directory of Hyvä Checkout module. After this, if you navigate to the checkout page from your site, then you will see all the payone options you have configured in the above step.

## Documentation

- If you need information on the build process of the React Checkout, then you can **[read more about it here](https://hyva-themes.github.io/magento2-react-checkout/build/)**.
- If you want to know more about how Hyvä Checkout helps you to integrate any payment methods, then **[read more about it here](https://hyva-themes.github.io/magento2-react-checkout/payment-integration/)**.
- The official documentation of **[Hyvä React Checkout](https://hyva-themes.github.io/magento2-react-checkout)**
- The documentation of **[Payone](https://github.com/PAYONE-GmbH/magento-2)** module

## Credits

This Checkout has been built in corporation - and with the support of - our main partner, integer_net.

# [![integer_net GmbH](https://github.com/hyva-themes/magento2-react-checkout/blob/documentation/docs/images/logo-integernet.png)](https://integer-net.de)

- [Rajeev K Tomy][link-author]
- [integer_net GmbH][link-company1]
- [All Contributors][link-contributors]

## License

The MIT License (MIT). Please see [License File](LICENSE.txt) for more information.

[ico-compatibility]: https://img.shields.io/badge/magento-%202.3%20|%202.4-brightgreen.svg?logo=magento&longCache=true&style=flat-square

[link-author]: https://github.com/progammer-rkt
[link-company1]: https://integer-net.com
[link-contributors]: ../../contributors
