/**
 * DTO for job details
 */
export type JobDetails = {
  /**
   * Job ID
   */
  id: number;

  /**
   * Job title or description
   */
  title: string;

  /**
   * Payment amount
   */
  amount: number; // Using number instead of BigDecimal

  /**
   * Payment status
   */
  status: string;

  /**
   * Date when the job was paid
   */
  paidAt: string; // ISO date-time string

  /**
   * Date when the job was created
   */
  createdAt: string; // ISO date-time string

  /**
   * Owner of the job
   */
  ownerName: string;
};
