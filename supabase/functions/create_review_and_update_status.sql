create or replace function create_review_and_update_status(
  p_contract_id uuid,
  p_review_content text
) returns void as $$
begin
  -- Insert the review
  insert into contract_reviews (
    contract_id,
    content,  -- changed from review_content to content to match the table structure
    created_at
  ) values (
    p_contract_id,
    p_review_content,
    now()
  );

  -- Update the contract status
  update contracts
  set status = 'completed'
  where id = p_contract_id;
end;
$$ language plpgsql;
