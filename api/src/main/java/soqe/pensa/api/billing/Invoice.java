package soqe.pensa.api.billing;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import soqe.pensa.api.common.AuditableEntity;

import java.util.UUID;

@Entity
@Table(name = "invoices")
@Getter
@Setter
public class Invoice extends AuditableEntity {

    @Column(name = "workspace_id", nullable = false)
    private UUID workspaceId;

    @Column(name = "stripe_invoice_id", nullable = false, unique = true)
    private String stripeInvoiceId;

    @Column(name = "amount_due", nullable = false)
    private Long amountDue;

    @Column(name = "amount_paid")
    private Long amountPaid;

    @Column(name = "currency", nullable = false)
    private String currency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InvoiceStatus status;

    @Column(name = "hosted_invoice_url")
    private String hostedInvoiceUrl;
}
