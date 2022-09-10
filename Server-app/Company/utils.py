import os
import sib_api_v3_sdk
from datetime import datetime


def send_job_processed_email(deleted_jobs: int, new_jobs: int, total_jobs: int, region: str):
    try:
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = os.environ.get("SENDING_BLUE_API_KEY")

        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

        subject = "Scheduled Job Processed"
        html_content = f"""<html>
                            <p>Job Processing Completed Successfully.</p>
                            <p>Region: {region}</p>
                            <p>time: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
                            <p>Deleted Jobs: {deleted_jobs}</p>
                            <p>New Jobs: {new_jobs}</p>
                            <p>Total Jobs In System: {total_jobs}</p>
                        </html>"""
        sender = {"name": "Workire", "email": "notify@workire.com"}
        to = [{"email": "workire.com@gmail.com", "name": "Muhammad Anees"},
              {"email": "waseemsabir2000@gmail.com", "name": "Waseem Sabir"}]
        reply_to = {"email": "replytome@gmail.ca", "name": "FName LName"}
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=to,
            reply_to=reply_to,
            html_content=html_content,
            sender=sender,
            subject=subject
        )
        api_instance.send_transac_email(send_smtp_email)
    except Exception as e:
        print("Exception when sending email for jobs processed", e)
