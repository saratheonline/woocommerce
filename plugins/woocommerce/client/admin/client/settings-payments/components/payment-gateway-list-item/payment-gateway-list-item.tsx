/**
 * External dependencies
 */
import { EllipsisMenu } from '@woocommerce/components';
import { WooPaymentMethodsLogos } from '@woocommerce/onboarding';
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import { PaymentProvider } from '@woocommerce/data';

/**
 * Internal dependencies
 */
import sanitizeHTML from '~/lib/sanitize-html';
import { StatusBadge } from '~/settings-payments/components/status-badge';
import { PaymentGatewayButtons } from '~/settings-payments/components/payment-gateway-buttons';
import { EllipsisMenuContent } from '~/settings-payments/components/ellipsis-menu-content';
import { isWooPayments } from '~/settings-payments/utils';

type PaymentGatewayItemProps = {
	gateway: PaymentProvider;
};

export const PaymentGatewayListItem = ( {
	gateway,
}: PaymentGatewayItemProps ) => {
	const isWCPay = isWooPayments( gateway.id );

	const hasIncentive =
		gateway.id === 'pre_install_woocommerce_payments_promotion';
	const determineGatewayStatus = () => {
		if ( ! gateway.state?.enabled && gateway.state?.needs_setup ) {
			return 'needs_setup';
		}
		if ( gateway.state?.enabled ) {
			if ( isWCPay ) {
				if ( gateway.state?.test_mode ) {
					return 'test_mode';
				}
			}
			return 'active';
		}

		return 'inactive';
	};

	return {
		key: gateway.id,
		className: `transitions-disabled woocommerce-item__payment-gateway ${
			isWCPay ?? `woocommerce-item__woocommerce-payment`
		} ${ hasIncentive ?? `has-incentive` }`,
		title: (
			<>
				{ gateway.title }
				{ hasIncentive ? (
					<StatusBadge
						status="has_incentive"
						message={ __(
							'Save 10% on processing fees',
							'woocommerce'
						) }
					/>
				) : (
					<StatusBadge status={ determineGatewayStatus() } />
				) }
			</>
		),
		content: (
			<>
				<span
					dangerouslySetInnerHTML={ sanitizeHTML(
						decodeEntities( gateway.description )
					) }
				/>
				{ isWCPay && (
					<WooPaymentMethodsLogos
						maxElements={ 10 }
						isWooPayEligible={ true }
					/>
				) }
			</>
		),
		after: (
			<div className="woocommerce-list__item-after__actions">
				<>
					<PaymentGatewayButtons
						id={ gateway.id }
						isOffline={ false }
						enabled={ gateway.state?.enabled || false }
						needsSetup={ gateway.state?.needs_setup }
						testMode={ gateway.state?.test_mode }
						settingsUrl={ gateway.management?.settings_url || '' }
					/>
					<EllipsisMenu
						label={ __( 'Task List Options', 'woocommerce' ) }
						renderContent={ ( { onToggle } ) => (
							<EllipsisMenuContent
								pluginId={ gateway.id }
								pluginName={ gateway.plugin.slug }
								isSuggestion={ false }
								links={ gateway.links }
								onToggle={ onToggle }
								isWooPayments={ isWCPay }
								isEnabled={ gateway.state?.enabled }
								needsSetup={ gateway.state?.needs_setup }
								testMode={ gateway.state?.test_mode }
							/>
						) }
					/>
				</>
			</div>
		),
		before: <img src={ gateway.icon } alt={ gateway.title + ' logo' } />,
	};
};