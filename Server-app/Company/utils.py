import os
import sib_api_v3_sdk
from datetime import datetime

from django.utils.text import slugify

from Company.models import Job, Company


def send_email(subject: str, body: str, sender=None, reply_to=None, to=None):
    if sender is None:
        sender = {"name": "Workire", "email": "notify@workire.com"}

    if reply_to is None:
        reply_to = {"email": "workire.com@gmail.com", "name": "Muhammad Anees"}

    if to is None:
        to = [{"email": "workire.com@gmail.com", "name": "Muhammad Anees"}]

    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = os.environ.get("SENDING_BLUE_API_KEY")

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=to,
        reply_to=reply_to,
        html_content=body,
        sender=sender,
        subject=subject
    )
    api_instance.send_transac_email(send_smtp_email)


def send_email_to_dev(subject: str, body: str):
    send_email(
        subject=subject,
        body=body,
        to=[{"email": "waseemsabir2000@gmail.com", "name": "Waseem Sabir"}]
    )


def send_job_processed_email(deleted_jobs: int, new_jobs: int, total_jobs: int, region: str):
    """
    Creates string to send and tries to send the text. Fails silently.
    """
    try:
        send_email(
            subject="Scheduled Job Processed",
            body=f"""<html>
                            <p>Job Processing Completed Successfully.</p>
                            <p>Region: {region}</p>
                            <p>time: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
                            <p>Deleted Jobs: {deleted_jobs}</p>
                            <p>New Jobs: {new_jobs}</p>
                            <p>Total Jobs In System: {total_jobs}</p>
                        </html>"""
        )
    except Exception as e:
        print("Exception when sending email for jobs processed", e)


# Takes company and job data objects and tries to save them in db
def save_job(job_data: dict, company: Company, region: int) -> Job:
    """
    Takes 
    """
    job = Job(
        Company=company,
        AdvertiserName=job_data['AdvertiserName'],
        AdvertiserType=job_data['AdvertiserType'],
        SenderReference=job_data['SenderReference'],
        DisplayReference=job_data['DisplayReference'],
        PostDate=job_data['PostDate'],
        Classification=job_data['Classification'],
        SubClassification=job_data['SubClassification'],
        Position=job_data['Position'],
        Description=job_data['Description'],
        Country=job_data['Country'],
        Location=job_data['Location'],
        Area=job_data['Area'],
        PostalCode=job_data['PostalCode'],
        ApplicationURL=job_data['ApplicationURL'],
        DescriptionURL=job_data['DescriptionURL'],
        Language=job_data['Language'],
        ContactName=job_data['ContactName'],
        EmploymentType=job_data['EmploymentType'],
        StartDate=job_data['StartDate'],
        Duration=job_data['Duration'],
        WorkHours=job_data['WorkHours'],
        SalaryCurrency=job_data['SalaryCurrency'],
        SalaryMinimum=job_data['SalaryMinimum'],
        SalaryMaximum=job_data['SalaryMaximum'],
        SalaryPeriod=job_data['SalaryPeriod'],
        SalaryAdditional=job_data['SalaryAdditional'],
        JobSource=job_data['JobSource'],
        JobSourceURL=job_data['JobSourceURL'],
        VideoLinkURL=job_data['VideoLinkURL'],
        AdditionalClassification1=job_data['AdditionalClassification1'],
        AdditionalClassification2=job_data['AdditionalClassification2'],
        AdditionalClassification3=job_data['AdditionalClassification3'],
        AdditionalClassification4=job_data['AdditionalClassification4'],
        LogoURL=company.logo, JobType=job_data['JobType'],
        Region=region
    )
    job.save()
    job.slug = slugify(job.Position) + '-' + str(job.id)  # save slug
    job.save()
    return job
