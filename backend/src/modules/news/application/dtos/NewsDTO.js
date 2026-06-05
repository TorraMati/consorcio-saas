export class CreateNewsDTO {
  constructor({ title, content, is_published, tenant_id, author_id }) {
    this.title = title?.trim();
    this.content = content?.trim();
    this.is_published = is_published ?? false;
    this.tenant_id = tenant_id;
    this.author_id = author_id;
  }
}